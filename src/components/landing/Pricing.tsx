import { Check, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const PLANS = [
  {
    name: "Residencial",
    price: "Sob consulta",
    description: "Ideal para casas e pequenos sobrados.",
    features: [
      "Monitoramento por Câmeras",
      "Alarme Residencial",
      "Cerca Elétrica",
      "Interfone / Vídeo Porteiro",
      "Suporte via WhatsApp",
    ],
    cta: "Solicitar Orçamento",
    highlight: false,
  },
  {
    name: "Condomínio",
    price: "Sob consulta",
    description: "Segurança completa para o seu condomínio.",
    features: [
      "Portaria Remota / Inteligente",
      "Câmeras Speed Dome PTZ",
      "Controle de Acesso Biométrico",
      "Manutenção Preventiva",
      "Projetos Personalizados",
    ],
    cta: "Falar com Especialista",
    highlight: true,
  },
  {
    name: "Empresarial",
    price: "Sob consulta",
    description: "Proteção total para comércios e empresas.",
    features: [
      "Circuito Interno de TV (CFTV)",
      "Sensores de Movimento",
      "Monitoramento 24h",
      "Relatórios de Acesso",
      "Instalação Profissional",
    ],
    cta: "Solicitar Orçamento",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="precos" className="py-20 lg:py-28 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/4 size-96 rounded-full bg-primary/5 blur-[120px]"
      />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
            Planos e Serviços
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Soluções sob medida para sua <span className="text-primary">segurança</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Escolha o plano que melhor atende às suas necessidades. Atendemos Porto Seguro, Cabrália, Trancoso e Arraial D'Ajuda.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-8 transition-all hover:shadow-xl ${
                plan.highlight
                  ? "border-primary bg-card ring-1 ring-primary scale-105 z-10"
                  : "border-border bg-card/50"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  MAIS PROCURADO
                </div>
              )}
              <div className="mb-8">
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tight">{plan.price}</span>
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="size-5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={buildWhatsAppUrl(
                  `Olá! Gostaria de um orçamento para o plano ${plan.name}. Pode me ajudar?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition-all ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:brightness-110 glow-primary"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <MessageCircle className="size-5" />
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
