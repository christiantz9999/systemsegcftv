import { createServerFn } from "@tanstack/react-start";
import {
  buildContactMessage,
  contactSchema,
  type ContactFieldErrors,
} from "./contact-schema";
import { buildWhatsAppUrl } from "./whatsapp";

type SubmitResult =
  | { ok: true; url: string; message: string }
  | { ok: false; errors: ContactFieldErrors };

/**
 * Valida o formulário de contato no servidor, aplicando as mesmas regras do
 * cliente, e devolve a mensagem/URL do WhatsApp já higienizada.
 */
export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
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
    return { ok: true, url: buildWhatsAppUrl(message), message };
  });
