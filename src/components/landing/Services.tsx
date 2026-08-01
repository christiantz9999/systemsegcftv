import {
  BellRing,
  Cctv,
  DoorOpen,
  Fingerprint,
  PhoneCall,
  Video,
  Wrench,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const SERVICES = [
  {
    icon: Cctv,
    title: "CFTV Profissional",
    description:
      "Câmeras de alta definição com visão noturna, gravação contínua e acesso remoto pelo celular.",
  },
  {
    icon: Zap,
    title: "Cercas Elétricas",
    description:
      "Proteção perimetral com choque e alarme integrados para casas, comércios e condomínios.",
  },
  {
    icon: DoorOpen,
    title: "Automação de Portões",
    description:
      "Motores para portões deslizantes, pivotantes e basculantes com controle remoto.",
  },
  {
    icon: BellRing,
    title: "Central de Alarme",
    description:
      "Sistemas com sensores de presença e abertura, sirenes e notificações no seu celular.",
  },
  {
    icon: Video,
    title: "Vídeo Porteiro",
    description:
      "Veja e fale com quem está na porta antes de abrir, direto do monitor ou do celular.",
  },
  {
    icon: PhoneCall,
    title: "Interfone",
    description:
      "Comunicação prática e segura entre portaria e unidades, residências e empresas.",
  },
  {
    icon: Fingerprint,
    title: "Fechadura Biométrica",
    description:
      "Acesso por digital, senha ou cartão — mais segurança e praticidade, sem chaves.",
  },
  {
    icon: Wrench,
    title: "Instalação e Manutenção",
    description:
      "Equipe especializada para instalação, configuração e manutenção preventiva.",
  },
];

export function Services() {
  return (
    <section id="servicos" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold tracking-[0.3em] text-primary">
            NOSSOS SERVIÇOS
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Soluções inteligentes em segurança{" "}
            <span className="text-primary">para você</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Do projeto à instalação, cuidamos de tudo. Escolha o serviço e peça
            seu orçamento direto no WhatsApp.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <service.icon className="size-6" aria-hidden />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <a
                href={buildWhatsAppUrl(
                  `Olá! Vim pelo site da SystemSeg e gostaria de um orçamento de ${service.title}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-accent"
              >
                Pedir orçamento
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
