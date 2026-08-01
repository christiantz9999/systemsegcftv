import { Instagram, Mail, MessageCircle } from "lucide-react";
import {
  DEFAULT_WHATSAPP_URL,
  EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WEBSITE,
  WHATSAPP_DISPLAY,
} from "@/lib/whatsapp";

const FOOTER_SERVICES = [
  "CFTV Profissional",
  "Cercas Elétricas",
  "Automação de Portões",
  "Central de Alarme",
  "Vídeo Porteiro",
  "Fechaduras Biométricas",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <a href="#inicio" className="flex flex-col leading-none">
            <span className="font-display text-2xl font-extrabold tracking-tight">
              <span className="text-primary">System</span>
              <span className="text-accent">Seg</span>
            </span>
            <span className="mt-1 text-[9px] font-semibold tracking-[0.32em] text-muted-foreground">
              SEGURANÇA ELETRÔNICA
            </span>
          </a>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Soluções inteligentes em segurança eletrônica para residências,
            comércios e empresas. Tecnologia que protege, segurança que você
            confia.
          </p>
        </div>

        <nav aria-label="Serviços">
          <h3 className="text-xs font-bold tracking-[0.3em] text-muted-foreground">
            SERVIÇOS
          </h3>
          <ul className="mt-5 space-y-3">
            {FOOTER_SERVICES.map((service) => (
              <li key={service}>
                <a
                  href="#servicos"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {service}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-bold tracking-[0.3em] text-muted-foreground">
            CONTATO
          </h3>
          <ul className="mt-5 space-y-4">
            <li>
              <a
                href={DEFAULT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <MessageCircle className="size-4 text-whatsapp" aria-hidden />
                {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Instagram className="size-4 text-accent" aria-hidden />
                {INSTAGRAM_HANDLE}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="size-4 text-primary" aria-hidden />
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} SystemSeg Segurança Eletrônica. Todos os direitos reservados.</p>
          <p>{WEBSITE}</p>
        </div>
      </div>
    </footer>
  );
}
