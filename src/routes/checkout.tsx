import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useCart, CartItem } from "@/lib/cart";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, CreditCard, ShieldCheck, CheckCircle2, Loader2, ChevronLeft, MessageSquare, ExternalLink, Pencil } from "lucide-react";
import { toast } from "sonner";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-32 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="size-24 rounded-full bg-secondary flex items-center justify-center mx-auto">
              <ShoppingBag className="size-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Você precisa adicionar produtos ao carrinho antes de finalizar a compra.
            </p>
            <Button asChild size="lg" className="font-bold">
              <Link to="/loja">Ir para a Loja</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format items for WhatsApp
      const itemsList = items
        .map((item: CartItem) => `- ${item.quantity}x ${item.name} (${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)})`)
        .join("\n");

      const totalValueFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice());

      const message = `*NOVO PEDIDO - SYSTEMSEG*\n\n` +
        `*CLIENTE:*\n` +
        `👤 ${formData.name}\n` +
        `📞 ${formData.phone}\n\n` +
        `*ENDEREÇO:*\n` +
        `📍 ${formData.address}, ${formData.city}\n` +
        `📮 CEP: ${formData.zip}\n\n` +
        `*PRODUTOS:*\n` +
        `${itemsList}\n\n` +
        `*TOTAL: ${totalValueFormatted}*\n\n` +
        `_Aguardando confirmação de disponibilidade e pagamento._`;

      const link = buildWhatsAppUrl(message);
      setWhatsappLink(link);
      setWhatsappMessage(message);
      
      setIsSuccess(true);
      toast.success("Pedido gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao processar pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsApp = () => {
    clearCart();
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  const handleEditData = () => {
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-32 pb-20 px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4 py-8 px-6 rounded-3xl bg-primary/5 border border-primary/10">
              <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="size-10 text-primary animate-bounce" />
              </div>
              <h1 className="text-3xl font-bold font-display">Pedido Quase Pronto!</h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Revisamos seu pedido. Clique no botão abaixo para abrir o WhatsApp e nos enviar a mensagem com seus dados.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/20 p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold">
                <MessageSquare className="size-5" />
                <span>Prévia da Mensagem:</span>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm bg-background p-6 rounded-xl border border-border leading-relaxed text-left overflow-x-auto">
                {whatsappMessage}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="font-bold py-8 px-10 text-lg rounded-xl shadow-xl shadow-primary/20">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  Abrir WhatsApp Agora
                  <ExternalLink className="ml-2 size-5" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg" className="font-bold">
                <Link to="/">Voltar para Início</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <Link to="/loja" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
              <ChevronLeft className="size-4 mr-1" />
              Voltar para Loja
            </Link>
            <h1 className="text-4xl font-bold font-display">Finalizar Pedido</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">1</span>
                    Seus Dados
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input 
                        id="name" 
                        required 
                        className="bg-secondary/30"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone / WhatsApp</Label>
                      <Input 
                        id="phone" 
                        required 
                        className="bg-secondary/30"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">2</span>
                    Endereço de Entrega
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço Completo</Label>
                      <Input 
                        id="address" 
                        required 
                        className="bg-secondary/30"
                        placeholder="Rua, número, complemento e bairro"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input 
                          id="city" 
                          required 
                          className="bg-secondary/30"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">CEP</Label>
                        <Input 
                          id="zip" 
                          required 
                          className="bg-secondary/30"
                          placeholder="00000-000"
                          value={formData.zip}
                          onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4 items-start">
                  <ShieldCheck className="size-6 text-primary shrink-0" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm">Compra Segura</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Seu pedido será enviado via WhatsApp para nossa equipe comercial que finalizará o atendimento, confirmará o estoque e passará as opções de pagamento.
                    </p>
                  </div>
                </div>
              </form>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
                <h2 className="text-xl font-bold">Resumo do Pedido</h2>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {items.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="size-14 rounded-lg bg-secondary overflow-hidden shrink-0 border border-border">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="size-full object-cover" />
                        ) : (
                          <div className="size-full flex items-center justify-center text-muted-foreground/30">
                            <ShoppingBag className="size-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.quantity}x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</p>
                      </div>
                      <span className="font-bold text-sm">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-border space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Frete</span>
                    <span className="text-green-500 font-bold uppercase text-xs">A combinar</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold font-display text-primary">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice())}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting} 
                  className="w-full font-bold py-8 text-lg rounded-xl shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 size-6 animate-spin" />
                  ) : (
                    <CreditCard className="mr-2 size-6" />
                  )}
                  Enviar Pedido via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
