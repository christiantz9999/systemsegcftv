import { z } from "zod";

export const SERVICE_OPTIONS = [
  "Câmeras",
  "Portões Automáticos",
  "Cerca Elétrica",
  "Interfone",
  "Fechadura Biométrica",
  "Vídeo Porteiro",
  "Outros",
] as const;

/** Remove caracteres de controle que poderiam quebrar a mensagem enviada. */
const clean = (value: string) =>
  value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();

export const contactSchema = z.object({
  nome: z
    .string()
    .transform(clean)
    .pipe(
      z
        .string()
        .min(3, "Por favor, informe seu nome completo (mínimo 3 caracteres).")
        .max(100, "O nome deve ter no máximo 100 caracteres."),
    ),
  telefone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(
      z
        .string()
        .min(10, "Informe um telefone válido com DDD (ex: 73 99999-9999).")
        .max(11, "Informe um telefone válido com DDD (ex: 73 99999-9999)."),
    ),
  endereco: z
    .string()
    .transform(clean)
    .pipe(
      z
        .string()
        .min(5, "Informe seu endereço completo para facilitar o atendimento.")
        .max(150, "O endereço deve ter no máximo 150 caracteres."),
    ),
  cidade: z
    .string()
    .transform(clean)
    .pipe(
      z
        .string()
        .min(2, "Informe sua cidade.")
        .max(80, "A cidade deve ter no máximo 80 caracteres."),
    ),
  servicos: z
    .array(z.enum(SERVICE_OPTIONS))
    .max(SERVICE_OPTIONS.length)
    .default([]),
  descricao: z
    .string()
    .transform(clean)
    .pipe(z.string().max(1000, "A descrição deve ter no máximo 1000 caracteres."))
    .default(""),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactFieldErrors = Partial<
  Record<"nome" | "telefone" | "endereco" | "cidade" | "descricao", string>
>;

export function formatPhone(input: string) {
  let digits = (input ?? "").replace(/\D/g, "");
  if (digits.length > 11 && digits.startsWith("55")) digits = digits.slice(2);
  if (digits.length === 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return digits || input;
}

export function buildContactMessage(data: ContactData) {
  return [
    "*Novo contato pelo site SystemSeg*",
    "",
    `*Nome:* ${data.nome}`,
    `*Telefone:* ${formatPhone(data.telefone)}`,
    `*Endereço:* ${data.endereco}`,
    `*Cidade:* ${data.cidade}`,
    `*Serviços de interesse:* ${data.servicos.length > 0 ? data.servicos.join(", ") : "Não informado"}`,
    data.descricao ? `*Descrição:* ${data.descricao}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
