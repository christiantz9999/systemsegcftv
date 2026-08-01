import { Award, Headset, House, ShieldCheck } from "lucide-react";
import technician from "@/assets/technician.jpg";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Segurança inteligente",
    description:
      "Projetos sob medida para cada ambiente, com as tecnologias mais confiáveis do mercado.",
  },
  {
    icon: Award,
    title: "Equipamentos de alta qualidade",
    description:
      "Trabalhamos com marcas reconhecidas e produtos com garantia de fábrica.",
  },
  {
    icon: Headset,
    title: "Suporte especializado",
    description:
      "Atendimento ágil antes, durante e depois da instalação. Você nunca fica sem resposta.",
  },
  {
    icon: House,
    title: "Proteção completa",
    description:
      "Soluções integradas: câmeras, alarmes, cercas, portões e controle de acesso em um só lugar.",
  },
];

export function WhyUs() {
  return (
    <section
      id="diferenciais"
      className="scroll-mt-20 border-y border-border bg-secondary/30 py-20 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative order-2 lg:order-1">
          <div
            aria-hidden
            className="absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl"
          />
          <img
            src={technician}
            alt="Técnico da SystemSeg instalando sistema de CFTV"
            width={1024}
            height={768}
            loading="lazy"
            className="relative rounded-3xl border border-border object-cover shadow-2xl"
          />
          <div className="absolute -bottom-6 left-6 rounded-2xl border border-border bg-card px-6 py-4 shadow-xl">
            <p className="font-display text-2xl font-extrabold text-primary">100%</p>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              COMPROMISSO COM SUA SEGURANÇA
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-xs font-bold tracking-[0.3em] text-primary">
            POR QUE A SYSTEMSEG
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tecnologia que protege.{" "}
            <span className="text-primary">Segurança que você confia.</span>
          </h2>

          <ul className="mt-10 space-y-7">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <feature.icon className="size-6" aria-hidden />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
