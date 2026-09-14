import { Instagram, Mail, MessageCircle, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  DEFAULT_WHATSAPP_URL,
  EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
} from "@/lib/whatsapp";
import { SERVICE_OPTIONS } from "@/lib/contact-schema";
import { submitContactForm } from "@/lib/contact.functions";

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const inputClass =
  "w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 focus-visible:ring-primary active:scale-[0.99] aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/30";

type Errors = {
  nome?: string | undefined;
  telefone?: string | undefined;
  endereco?: string | undefined;
  cidade?: string | undefined;
};

export function ContactForm() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [servicos, setServicos] = useState<string[]>([]);
  const [descricao, setDescricao] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleServico(option: string) {
    setServicos((prev) =>
      prev.includes(option)
        ? prev.filter((s) => s !== option)
        : [...prev, option],
    );
  }

  function validate() {
    const nextErrors: Errors = {};
    const phoneDigits = telefone.replace(/\D/g, "");

    if (nome.trim().length < 3) {
      nextErrors.nome = "Por favor, informe seu nome completo (mínimo 3 caracteres).";
    }

    if (phoneDigits.length < 10) {
      nextErrors.telefone = "Informe um telefone válido com DDD (ex: 73 99999-9999).";
    }

    if (!endereco.trim() || endereco.trim().length < 5) {
      nextErrors.endereco = "Informe seu endereço completo para facilitar o atendimento.";
    }

    if (!cidade.trim()) {
      nextErrors.cidade = "Informe sua cidade.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    if (!validate()) {
      setIsSubmitting(false);
      // Rolar até o primeiro erro para acessibilidade
      const firstError = document.querySelector('[aria-invalid="true"]');
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      (firstError as HTMLElement)?.focus();
      return;
    }

    const message = [
      "*Novo contato pelo site SystemSeg*",
      "",
      `*Nome:* ${nome.trim()}`,
      `*Telefone:* ${telefone}`,
      `*Endereço:* ${endereco.trim()}`,
      `*Cidade:* ${cidade.trim()}`,
      `*Serviços de interesse:* ${servicos.length > 0 ? servicos.join(", ") : "Não informado"}`,
      descricao.trim() ? `*Descrição:* ${descricao.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
      setSent(true);
      // Limpar formulário após envio bem-sucedido (opcional, mas bom UX)
      setNome("");
      setTelefone("");
      setEndereco("");
      setCidade("");
      setServicos([]);
      setDescricao("");
    } catch (err) {
      console.error("Erro ao abrir WhatsApp:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contato"
      className="scroll-mt-20 border-t border-border bg-secondary/30 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold tracking-[0.3em] text-primary">
            FALE CONOSCO
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Entre em contato e{" "}
            <span className="text-primary">solicite seu orçamento</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Preencha o formulário e sua mensagem chega completa no nosso WhatsApp.
            Respondemos rápido!
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Contact channels */}
          <div className="space-y-4 lg:col-span-2">
            <a
              href={DEFAULT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-whatsapp/15 text-whatsapp">
                <MessageCircle className="size-6" aria-hidden />
              </span>
              <span>
                <span className="block text-xs font-semibold tracking-wide text-muted-foreground">
                  WHATSAPP
                </span>
                <span className="block font-display text-lg font-bold">
                  {WHATSAPP_DISPLAY}
                </span>
              </span>
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Instagram className="size-6" aria-hidden />
              </span>
              <span>
                <span className="block text-xs font-semibold tracking-wide text-muted-foreground">
                  INSTAGRAM
                </span>
                <span className="block font-display text-lg font-bold">
                  {INSTAGRAM_HANDLE}
                </span>
              </span>
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Mail className="size-6" aria-hidden />
              </span>
              <span>
                <span className="block text-xs font-semibold tracking-wide text-muted-foreground">
                  E-MAIL
                </span>
                <span className="block break-all font-display text-base font-bold">
                  {EMAIL}
                </span>
              </span>
            </a>

            <p className="rounded-2xl border border-dashed border-border p-5 text-sm leading-relaxed text-muted-foreground">
              Atendemos residências, comércios, condomínios e empresas. Envie seu
              pedido e retornamos com o orçamento.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:col-span-3"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="nome" className="mb-2 block text-sm font-semibold">
                  Nome completo <span className="text-primary">*</span>
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    if (errors.nome) setErrors((prev) => ({ ...prev, nome: undefined }));
                  }}
                  placeholder="Seu nome completo"
                  maxLength={100}
                  className={inputClass}
                  autoComplete="name"
                  aria-invalid={!!errors.nome}
                  aria-describedby={errors.nome ? "nome-error" : undefined}
                  required
                />
                {errors.nome && (
                  <p id="nome-error" className="mt-1.5 text-xs font-medium text-destructive" role="alert">
                    {errors.nome}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="telefone" className="mb-2 block text-sm font-semibold">
                  Telefone <span className="text-primary">*</span>
                </label>
                <input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => {
                    setTelefone(maskPhone(e.target.value));
                    if (errors.telefone) setErrors((prev) => ({ ...prev, telefone: undefined }));
                  }}
                  placeholder="(73) 99999-9999"
                  className={inputClass}
                  autoComplete="tel"
                  aria-invalid={!!errors.telefone}
                  aria-describedby={errors.telefone ? "telefone-error" : undefined}
                  required
                />
                {errors.telefone && (
                  <p id="telefone-error" className="mt-1.5 text-xs font-medium text-destructive" role="alert">
                    {errors.telefone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="cidade" className="mb-2 block text-sm font-semibold">
                  Cidade <span className="text-primary">*</span>
                </label>
                <input
                  id="cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => {
                    setCidade(e.target.value);
                    if (errors.cidade) setErrors((prev) => ({ ...prev, cidade: undefined }));
                  }}
                  placeholder="Sua cidade"
                  maxLength={80}
                  className={inputClass}
                  autoComplete="address-level2"
                  aria-invalid={!!errors.cidade}
                  aria-describedby={errors.cidade ? "cidade-error" : undefined}
                  required
                />
                {errors.cidade && (
                  <p id="cidade-error" className="mt-1.5 text-xs font-medium text-destructive" role="alert">
                    {errors.cidade}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="endereco" className="mb-2 block text-sm font-semibold">
                  Endereço <span className="text-primary">*</span>
                </label>
                <input
                  id="endereco"
                  type="text"
                  value={endereco}
                  onChange={(e) => {
                    setEndereco(e.target.value);
                    if (errors.endereco) setErrors((prev) => ({ ...prev, endereco: undefined }));
                  }}
                  placeholder="Rua, número, bairro"
                  maxLength={150}
                  className={inputClass}
                  autoComplete="street-address"
                  aria-invalid={!!errors.endereco}
                  aria-describedby={errors.endereco ? "endereco-error" : undefined}
                  required
                />
                {errors.endereco && (
                  <p id="endereco-error" className="mt-1.5 text-xs font-medium text-destructive" role="alert">
                    {errors.endereco}
                  </p>
                )}
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className="mb-3 text-sm font-semibold">
                Quais serviços você precisa?
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {SERVICE_OPTIONS.map((option) => {
                  const selected = servicos.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        selected
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleServico(option)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className={`flex size-4 items-center justify-center rounded border transition-colors ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/50"
                        }`}
                      >
                        {selected && (
                          <svg viewBox="0 0 12 12" className="size-3 fill-none stroke-current stroke-2">
                            <path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {option}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-6">
              <label htmlFor="descricao" className="mb-2 block text-sm font-semibold">
                Descrição
              </label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Conte um pouco do que você precisa (opcional)"
                rows={4}
                maxLength={1000}
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 glow-primary disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <Send className="size-4" aria-hidden />
              )}
              {isSubmitting ? "Enviando..." : "Enviar pelo WhatsApp"}
            </button>

            {sent && (
              <p className="mt-4 rounded-lg border border-whatsapp/30 bg-whatsapp/10 px-4 py-3 text-center text-sm font-medium text-whatsapp">
                Abrimos o WhatsApp com sua mensagem pronta. É só confirmar o envio
                por lá!
              </p>
            )}

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Ao enviar, o WhatsApp abre com o formulário completo — nenhum dado
              fica armazenado no site.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
