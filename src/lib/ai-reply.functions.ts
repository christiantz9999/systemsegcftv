import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const suggestInputSchema = z.object({
  nome: z.string().trim().min(3).max(100),
  telefone: z.string().trim().min(10).max(20),
  cidade: z.string().trim().max(80),
  servicos: z.array(z.string().trim().min(1).max(80)).max(7),
  descricao: z.string().trim().max(1000),
});

type SuggestResult = { ok: true; suggestion: string } | { ok: false; error: string };

/**
 * Gera uma sugestão de resposta para a mensagem de contato usando a Lovable AI.
 * A resposta NÃO é enviada automaticamente: o administrador revisa e aprova.
 */
export const suggestContactReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => suggestInputSchema.parse(input))
  .handler(async ({ data, context }): Promise<SuggestResult> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) return { ok: false, error: "Acesso restrito ao administrador." };

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false, error: "Serviço de IA indisponível no momento." };

    const prompt = [
      "Escreva uma resposta curta, cordial e profissional em português do Brasil para este cliente da SystemSeg (segurança eletrônica em Porto Seguro e região: CFTV, portões automáticos, cerca elétrica, interfone, fechadura biométrica e vídeo porteiro).",
      "A resposta deve agradecer o contato, citar os serviços de interesse, oferecer visita técnica ou orçamento sem compromisso e terminar convidando para falar no WhatsApp. No máximo 120 palavras. Não invente preços nem prazos.",
      "",
      `Nome: ${data.nome}`,
      `Telefone: ${data.telefone}`,
      `Cidade: ${data.cidade}`,
      `Serviços de interesse: ${data.servicos.length ? data.servicos.join(", ") : "não informado"}`,
      `Mensagem do cliente: ${data.descricao || "não informada"}`,
    ].join("\n");

    let response: Response;
    try {
      response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": apiKey,
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({
          model: "openai/gpt-6-astra",
          input: prompt,
          stream: true,
          reasoning: { effort: "low", summary: "auto" },
        }),
      });
    } catch {
      return { ok: false, error: "Não foi possível falar com o serviço de IA. Tente novamente." };
    }

    if (!response.ok || !response.body) {
      if (response.status === 429)
        return { ok: false, error: "Muitas solicitações seguidas. Aguarde alguns segundos e tente de novo." };
      if (response.status === 402)
        return { ok: false, error: "Os créditos de IA do projeto acabaram. Adicione créditos para continuar." };
      if (response.status === 403)
        return { ok: false, error: "O uso de IA está bloqueado nas configurações do projeto." };
      return { ok: false, error: "O serviço de IA não respondeu corretamente. Tente novamente." };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const event = JSON.parse(payload) as {
            type?: string;
            delta?: string;
            response?: { output_text?: string };
          };
          if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
            text += event.delta;
          } else if (
            event.type === "response.completed" &&
            !text &&
            typeof event.response?.output_text === "string"
          ) {
            text = event.response.output_text;
          }
        } catch {
          // ignora eventos parciais
        }
      }
    }

    const suggestion = text.trim();
    if (!suggestion)
      return { ok: false, error: "A IA não conseguiu gerar uma sugestão agora. Tente novamente." };

    return { ok: true, suggestion };
  });
