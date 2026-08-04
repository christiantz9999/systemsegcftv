import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { ChevronDown, ChevronUp, ShoppingCart, MapPin, User, CalendarClock, ExternalLink } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/admin/pedidos')({
  component: AdminOrders,
})

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Aguardando contato' },
  { value: 'contacted', label: 'Em atendimento' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
]

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  contacted: 'bg-primary/10 text-primary',
  completed: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-destructive/10 text-destructive',
}

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erro ao buscar pedidos')
    } else {
      setOrders(data || [])
    }
    setIsLoading(false)
  }

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao atualizar status')
    } else {
      toast.success('Status atualizado')
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    }
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-display">Pedidos</h1>
              <p className="text-muted-foreground">Acompanhe os pedidos gerados no checkout da loja.</p>
            </div>
            <Button asChild variant="outline" className="font-bold">
              <Link to="/admin">Voltar ao Painel</Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className="font-bold"
              onClick={() => setStatusFilter('all')}
            >
              Todos ({orders.length})
            </Button>
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={statusFilter === option.value ? 'default' : 'outline'}
                size="sm"
                className="font-bold"
                onClick={() => setStatusFilter(option.value)}
              >
                {option.label} ({orders.filter((o) => o.status === option.value).length})
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center text-muted-foreground">
                Carregando pedidos...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center">
                <ShoppingCart className="size-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const items = (order.items as any[]) || []
                const isExpanded = expandedId === order.id
                return (
                  <div key={order.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                    <button
                      type="button"
                      className="w-full px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-left hover:bg-secondary/20 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold font-display">{order.reference}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {order.customer_name} — {order.customer_phone}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarClock className="size-4" />
                        {new Date(order.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="text-sm text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'itens'}</span>
                      <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-center ${STATUS_STYLES[order.status] || 'bg-secondary text-muted-foreground'}`}>
                        {STATUS_OPTIONS.find((s) => s.value === order.status)?.label || order.status}
                      </span>
                      {isExpanded ? <ChevronUp className="size-5 shrink-0" /> : <ChevronDown className="size-5 shrink-0" />}
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 border-t border-border space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <h3 className="font-bold flex items-center gap-2 text-sm">
                              <User className="size-4 text-primary" />
                              Cliente
                            </h3>
                            <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                            <p className="text-sm text-muted-foreground flex items-start gap-1.5">
                              <MapPin className="size-4 mt-0.5 shrink-0" />
                              {order.address}, {order.city}
                              {order.zip ? ` — CEP ${order.zip}` : ''}
                            </p>
                            <a
                              href={`/pedido/${order.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-primary font-bold hover:underline"
                            >
                              <ExternalLink className="size-4" />
                              Abrir link de recuperação
                            </a>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-bold text-sm">Itens</h3>
                            <div className="space-y-1.5">
                              {items.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between text-sm gap-4">
                                  <span className="text-muted-foreground truncate">
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between font-bold pt-2 border-t border-border">
                              <span>Total</span>
                              <span className="text-primary">{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <span className="text-sm font-bold mr-2">Alterar status:</span>
                          {STATUS_OPTIONS.map((option) => (
                            <Button
                              key={option.value}
                              variant={order.status === option.value ? 'default' : 'outline'}
                              size="sm"
                              className="font-bold"
                              disabled={order.status === option.value}
                              onClick={() => handleStatusChange(order.id, option.value)}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
