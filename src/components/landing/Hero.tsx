import { CheckCircle2, MessageCircle } from "lucide-react";
import heroCamera from "@/assets/hero-camera.png";
import { DEFAULT_WHATSAPP_URL } from "@/lib/whatsapp";

const TRUST_POINTS = [
  "Orçamento sem compromisso",
  "Instalação especializada",
  "Suporte pós-venda",
];

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pb-20 pt-28 lg:pb-28 lg:pt-36">
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 size-[480px] rounded-full bg-primary/15 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 size-[420px] rounded-full bg-accent/15 blur-[140px]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            SEGURANÇA ELETRÔNICA PROFISSIONAL
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Proteja o que é seu com{" "}
            <span className="text-primary">tecnologia e confiança</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            CFTV profissional, cercas elétricas, automação de portões, centrais de
            alarme, videoporteiro e fechaduras biométricas. Soluções completas em
            segurança para sua casa, comércio ou empresa.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={DEFAULT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 glow-primary"
            >
              <MessageCircle className="size-5" aria-hidden />
              Solicitar orçamento grátis
            </a>
            <a
              href="#servicos"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/60 px-7 py-4 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
            >
              Conhecer serviços
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {TRUST_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <CheckCircle2 className="size-4 text-accent" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden
            className="absolute inset-8 rounded-full bg-accent/25 blur-[100px]"
          />
          <div
            aria-hidden
            className="absolute inset-x-16 bottom-0 top-1/2 rounded-full bg-primary/20 blur-[90px]"
          />
          <img
            src={heroCamera}
            alt="Câmera de segurança PTZ profissional SystemSeg"
            width={1024}
            height={1024}
            className="relative z-10 w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
