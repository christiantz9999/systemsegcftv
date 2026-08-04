import { Menu, MessageCircle, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import logoAsset from "@/assets/logo-systemseg.png.asset.json";
import { DEFAULT_WHATSAPP_URL } from "@/lib/whatsapp";

const NAV_ITEMS = [
  { label: "Serviços", href: "#servicos" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Equipamentos", href: "#equipamentos" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Loja", href: "/loja" },
  { label: "Contato", href: "#contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="flex items-center gap-2.5 py-1.5 leading-none">
          <img
            src={logoAsset.url}
            alt="Logomarca da SystemSeg – Segurança Eletrônica"
            className="size-9 shrink-0 object-contain sm:size-10"
          />
          <div className="flex flex-col">
            <span className="font-display text-xl font-extrabold tracking-tight">
              <span className="text-primary">System</span>
              <span className="text-logo-blue">Seg</span>
            </span>
            <span className="mt-0.5 text-[9px] font-semibold tracking-[0.32em] text-muted-foreground">
              SEGURANÇA ELETRÔNICA
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => (
            item.href.startsWith("/") ? (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={DEFAULT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 sm:inline-flex"
          >
            <MessageCircle className="size-4" aria-hidden />
            Orçamento grátis
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-border bg-background px-4 pb-6 pt-2 lg:hidden"
          aria-label="Navegação móvel"
        >
          {NAV_ITEMS.map((item) => (
            item.href.startsWith("/") ? (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </a>
            )
          ))}
          <a
            href={DEFAULT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
          >
            <MessageCircle className="size-4" aria-hidden />
            Solicitar orçamento grátis
          </a>
        </nav>
      )}
    </header>
  );
}
