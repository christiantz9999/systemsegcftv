import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ShoppingBag, ChevronRight, Package, CreditCard, ShieldCheck } from "lucide-react";
import { DEFAULT_WHATSAPP_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/loja")({
  head: () => ({
    meta: [
      { title: "Loja SystemSeg | Equipamentos de Segurança Profissional" },
      { name: "description", content: "Compre câmeras Intelbras, alarmes, cercas elétricas e acessórios de segurança. Produtos originais com garantia." },
    ],
  }),
  component: ShopPage,
});

const CATEGORIES = [
  { name: "Câmeras", count: 24 },
  { name: "Alarmes", count: 12 },
  { name: "Fechaduras", count: 8 },
  { name: "Acessórios", count: 45 },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Câmera Intelbras PTZ Speed Dome",
    price: "R$ 1.890,00",
    category: "Câmeras",
    image: "https://images.unsplash.com/photo-1557862954-6242ce96647a?q=80&w=600&auto=format&fit=crop",
    badge: "Top de Linha",
  },
  {
    id: 2,
    name: "Kit Alarme Profissional Intelbras",
    price: "R$ 799,00",
    category: "Alarmes",
    image: "https://images.unsplash.com/photo-1558002038-1037906d9627?q=80&w=600&auto=format&fit=crop",
    badge: "Mais Vendido",
  },
  {
    id: 3,
    name: "Fechadura Biométrica Digital",
    price: "R$ 549,90",
    category: "Fechaduras",
    image: "https://images.unsplash.com/photo-1558444465-28563f68a25c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "NVR Intelbras 8 Canais 4K",
    price: "R$ 1.250,00",
    category: "Câmeras",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
  }
];

function ShopPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero da Loja */}
          <div className="mb-12 overflow-hidden rounded-3xl bg-secondary/50 border border-border">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <div className="inline-flex items-center gap-2 mb-6 text-primary text-sm font-bold tracking-wider uppercase">
                  <Package className="size-4" />
                  Pronta Entrega em Porto Seguro
                </div>
                <h1 className="font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl mb-6 tracking-tight">
                  Equipamentos <span className="text-primary">Profissionais</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                  As melhores tecnologias de segurança das marcas líderes mundiais, agora disponíveis para você com garantia e suporte local.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href={DEFAULT_WHATSAPP_URL}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                  >
                    Falar com Vendedor
                    <ChevronRight className="size-5" />
                  </a>
                </div>
              </div>
              <div className="relative aspect-square lg:aspect-auto bg-primary/10 flex items-center justify-center p-12">
                <ShoppingBag className="size-48 text-primary opacity-20 absolute" />
                <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-md">
                   {/* Decorative blocks */}
                   <div className="aspect-square rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
                     <ShieldCheck className="size-12 text-primary" />
                   </div>
                   <div className="aspect-square rounded-2xl bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center translate-y-8">
                     <CreditCard className="size-12 text-accent" />
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar / Filtros */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="font-display text-lg font-bold mb-4">Categorias</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat.name}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-left"
                      >
                        {cat.name}
                        <span className="text-xs font-bold text-primary/60">{cat.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-primary mb-2">Precisa de Ajuda?</h4>
                  <p className="text-xs text-muted-foreground mb-4">Nossos especialistas ajudam você a escolher o melhor kit para sua casa ou empresa.</p>
                  <a 
                    href={DEFAULT_WHATSAPP_URL}
                    className="block w-full text-center rounded-lg bg-primary/20 py-2.5 text-xs font-bold text-primary hover:bg-primary/30 transition-colors"
                  >
                    Consultar Técnico
                  </a>
                </div>
              </div>
            </aside>

            {/* Grid de Produtos */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl font-bold">Catálogo Disponível</h2>
                <span className="text-sm text-muted-foreground">{PRODUCTS.length} produtos encontrados</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {PRODUCTS.map(product => (
                  <div key={product.id} className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
                    <div className="aspect-[4/3] overflow-hidden bg-secondary">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground shadow-lg">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">{product.category}</span>
                      <h3 className="font-bold text-lg mb-3 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xl font-extrabold text-primary">{product.price}</span>
                        <a 
                          href={`${DEFAULT_WHATSAPP_URL}&text=Olá! Tenho interesse no produto: ${product.name}`}
                          className="rounded-lg bg-secondary p-2 text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                          title="Comprar via WhatsApp"
                        >
                          <ShoppingBag className="size-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}