import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useCart, CartItem } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Loader2,
  PackageX,
  RotateCcw,
  CalendarClock,
  MapPin,
  User,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/pedido/$orderId")({
  head: () => ({
    meta: [
      { title: "Recuperar Pedido — SystemSeg" },
      { name: "description", content: "Recupere seu pedido SystemSeg e finalize sua compra pelo WhatsApp." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderRecoveryPage,
});

interface RecoveredOrder {
  id: string;
  reference: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  city: string;
  zip: string | null;
  items: CartItem[];
  total: number;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Aguardando contato",
  contacted: "Em atendimento",
  completed: "Concluído",
  cancelled: "Cancelado",
};

function OrderRecoveryPage() {
  const { orderId } = Route.useParams();
  const navigate = useNavigate();
  const restoreItems = useCart((s) => s.restoreItems);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order-recovery", orderId],
    queryFn: async (): Promise<RecoveredOrder | null> => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, reference, customer_name, customer_phone, address, city, zip, items, total, status, created_at")
        .eq("id", orderId)
        .maybeSingle();
      if (error) throw error;
      return data as RecoveredOrder | null;
    },
    retry: false,
  });

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const handleRestore = () => {
    if (!order) return;
    restoreItems(order.items);
    localStorage.setItem(
      "checkout-recovery",
      JSON.stringify({
        name: order.customer_name,
        phone: order.customer_phone,
        address: order.address,
        city: order.city,
        zip: order.zip ?? "",
      })
    );
    toast.success("Pedido restaurado! Revise e finalize.");
    navigate({ to: "/checkout" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Buscando seu pedido...</p>
            </div>
          ) : !order ? (
            <div className="text-center space-y-6 py-16">
              <div className="size-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <PackageX className="size-10 text-destructive" />
              </div>
              <h1 className="text-3xl font-bold font-display">Pedido não encontrado</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                O link pode estar incorreto ou o pedido não existe mais. Verifique o link ou monte um novo carrinho na nossa loja.
              </p>
              <Button asChild size="lg" className="font-bold">
                <Link to="/loja">Ir para a Loja</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center space-y-4 py-8 px-6 rounded-3xl bg-primary/5 border border-primary/10">
                <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Receipt className="size-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold font-display">Pedido {order.reference}</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Encontramos seu pedido! Revise os itens abaixo e restaure seu carrinho para finalizar a compra pelo WhatsApp.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground">
                    <CalendarClock className="size-4" />
                    {new Date(order.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold">
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/20 p-6 space-y-4">
                <h2 className="font-bold flex items-center gap-2">
                  <ShoppingBag className="size-5 text-primary" />
                  Itens do Pedido
                </h2>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-3 rounded-xl bg-background border border-border">
                      <div className="size-14 rounded-lg bg-secondary overflow-hidden shrink-0">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.name} className="size-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="font-bold text-primary shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary font-display">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/20 p-6 space-y-3">
                <h2 className="font-bold flex items-center gap-2">
                  <User className="size-5 text-primary" />
                  Seus Dados
                </h2>
                <p className="text-sm text-muted-foreground">{order.customer_name} — {order.customer_phone}</p>
                <p className="text-sm text-muted-foreground flex items-start gap-1.5">
                  <MapPin className="size-4 mt-0.5 shrink-0" />
                  {order.address}, {order.city}
                  {order.zip ? ` — CEP ${order.zip}` : ""}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button
                  size="lg"
                  className="font-bold py-8 px-10 text-lg rounded-xl shadow-xl shadow-primary/20"
                  onClick={handleRestore}
                >
                  <RotateCcw className="mr-2 size-5" />
                  Restaurar e Finalizar Pedido
                </Button>
                <Button asChild variant="outline" size="lg" className="font-bold">
                  <Link to="/loja">Voltar para a Loja</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
