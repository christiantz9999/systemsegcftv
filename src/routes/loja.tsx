import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ShoppingBag, ChevronRight, Package, CreditCard, ShieldCheck, Loader2, PlusCircle } from "lucide-react";
import { DEFAULT_WHATSAPP_URL } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/loja")({
  head: () => ({
    meta: [
      { title: "Loja SystemSeg | Equipamentos de Segurança Profissional" },
      { name: "description", content: "Compre câmeras Intelbras, alarmes, cercas elétricas e acessórios de segurança. Produtos originais com garantia." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch categories with product counts
    const { data: catData } = await supabase.from('categories').select('*').order('name');
    
    // Fetch products
    const { data: prodData } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (catData) setCategories(catData);
    if (prodData) setProducts(prodData);
    
    setIsLoading(false);
  };

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

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
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors text-left ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                    >
                      Todos os Produtos
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors text-left ${selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                      >
                        {cat.name}
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
                <span className="text-sm text-muted-foreground">{filteredProducts.length} produtos encontrados</span>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                  <Loader2 className="size-10 animate-spin text-primary" />
                  <p className="font-medium">Carregando catálogo...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
                      <div className="aspect-[4/3] overflow-hidden bg-secondary">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="size-12 text-muted-foreground/50" />
                          </div>
                        )}
                        {product.stock_quantity <= 5 && (
                          <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-[10px] font-bold text-destructive-foreground shadow-lg">
                            Poucas Unidades
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">{product.categories?.name}</span>
                        <h3 className="font-bold text-lg mb-3 line-clamp-1">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="font-display text-xl font-extrabold text-primary">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                          </span>
                           <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                addItem(product);
                                toast.success(`${product.name} adicionado ao carrinho!`);
                              }}
                              className="rounded-lg bg-primary p-2 text-primary-foreground hover:scale-110 transition-all shadow-lg shadow-primary/20"
                              title="Adicionar ao carrinho"
                            >
                              <PlusCircle className="size-5" />
                            </button>
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
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <Package className="size-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">Nenhum produto disponível nesta categoria no momento.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
