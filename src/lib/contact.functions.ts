import { createServerFn } from "@tanstack/react-start";
import {
  buildContactMessage,
  contactSchema,
  type ContactFieldErrors,
} from "./contact-schema";
import { buildWhatsAppUrl } from "./whatsapp";

type SubmitResult =
  | { ok: true; url: string; message: string }
  | { ok: false; errors: ContactFieldErrors; formError?: string };

/**
 * Valida o formulário de contato no servidor, aplicando as mesmas regras do
 * cliente, e devolve a mensagem/URL do WhatsApp já higienizada.
 */
export const submitContactForm = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<SubmitResult> => {
    const parsed = contactSchema.safeParse(data);

    if (!parsed.success) {
      const errors: ContactFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (
          typeof field === "string" &&
          field in { nome: 1, telefone: 1, endereco: 1, cidade: 1, descricao: 1 } &&
          !errors[field as keyof ContactFieldErrors]
        ) {
          errors[field as keyof ContactFieldErrors] = issue.message;
        }
      }
      return { ok: false, errors };
    }

    const message = buildContactMessage(parsed.data);

    // Registra a mensagem no painel administrativo (independe do WhatsApp).
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("contact_messages").insert({
        name: parsed.data.nome,
        phone: parsed.data.telefone,
        address: parsed.data.endereco,
        city: parsed.data.cidade,
        services: parsed.data.servicos,
        description: parsed.data.descricao || null,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Falha ao registrar mensagem de contato", error);
      return {
        ok: false,
        errors: {},
        formError: "Não foi possível registrar sua mensagem agora. Tente novamente em instantes.",
      };
    }

    return { ok: true, url: buildWhatsAppUrl(message), message };
  });

