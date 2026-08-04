import { ShoppingCart, Plus, Minus, Trash2, X, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 text-foreground hover:text-primary transition-colors">
          <ShoppingCart className="size-6" />
          {totalItems() > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg">
              {totalItems()}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-background border-border">
        <SheetHeader className="pb-6 border-b border-border">
          <SheetTitle className="text-2xl font-bold font-display flex items-center gap-2">
            <ShoppingCart className="size-6 text-primary" />
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
              <div className="size-20 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingCart className="size-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Carrinho vazio</h3>
                <p className="text-sm text-muted-foreground">
                  Você ainda não adicionou nenhum produto ao seu carrinho.
                </p>
              </div>
              <SheetTrigger asChild>
                <Button className="font-bold">Voltar para Loja</Button>
              </SheetTrigger>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="size-20 rounded-xl bg-secondary overflow-hidden shrink-0 border border-border">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center">
                      <ShoppingCart className="size-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex justify-between gap-2">
                    <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <p className="text-primary font-bold font-display">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.price)}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-lg border border-border bg-secondary/50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:text-primary transition-colors"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:text-primary transition-colors"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="pt-6 border-t border-border flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Subtotal</span>
              <span className="text-2xl font-bold font-display text-primary">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalPrice())}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full font-bold py-6 text-base">
                <Link to="/checkout" search={{}}>
                  Finalizar Pedido
                  <ChevronRight className="ml-2 size-5" />
                </Link>
              </Button>
              <SheetTrigger asChild>
                <Button variant="ghost" className="w-full text-muted-foreground">
                  Continuar Comprando
                </Button>
              </SheetTrigger>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
