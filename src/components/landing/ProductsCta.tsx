import { Check, MessageCircle } from "lucide-react";
import cameraSpeedDome from "@/assets/camera-speeddome.jpg";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const PRODUCT_LINES = [
  "Câmeras, DVRs, fontes, cabos e acessórios",
  "Fechaduras biométricas e controles de acesso",
  "Motores, centrais de alarme e sensores",
];

export function ProductsCta() {
  return (
    <section id="equipamentos" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary/10 blur-[120px]"
          />
          <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <span className="text-xs font-bold tracking-[0.3em] text-primary">
                EQUIPAMENTOS
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Compre equipamentos de segurança{" "}
                <span className="text-primary">com quem entende</span>
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Além da instalação, vendemos produtos de alta qualidade com
                orientação técnica para você escolher certo.
              </p>
              <ul className="mt-6 space-y-3">
                {PRODUCT_LINES.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm font-medium">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              <a
                href={buildWhatsAppUrl(
                  "Olá! Vim pelo site da SystemSeg e quero comprar equipamentos de segurança. Podem me ajudar?",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 glow-primary"
              >
                <MessageCircle className="size-5" aria-hidden />
                Consultar produtos no WhatsApp
              </a>
            </div>
            <div className="relative">
              <img
                src={cameraSpeedDome}
                alt="Câmera Intelbras Speed Dome moderna em cenário cinematográfico de segurança"
                width={1024}
                height={768}
                loading="lazy"
                className="rounded-2xl border border-border object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
