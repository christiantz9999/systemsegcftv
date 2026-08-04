import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { ChevronDown, ChevronUp, ShoppingCart, MapPin, User, CalendarClock, ExternalLink, History, Search, Calendar as CalendarIcon, X } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/admin/pedidos')({
  component: AdminOrders,
})

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Aguardando contato' },
  { value: 'contacted', label: 'Em atendimento' },
  { value: 'paid', label: 'Pago' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
]

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  contacted: 'bg-primary/10 text-primary',
  paid: 'bg-blue-500/10 text-blue-500',
  shipped: 'bg-purple-500/10 text-purple-500',
  delivered: 'bg-emerald-500/10 text-emerald-500',
  completed: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-destructive/10 text-destructive',
}

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [history, setHistory] = useState<Record<string, any[]>>({})
  const [loadingHistory, setLoadingHistory] = useState<Record<string, boolean>>({})

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

  const fetchHistory = async (orderId: string) => {
    setLoadingHistory(prev => ({ ...prev, [orderId]: true }))
    const { data, error } = await supabase
      .from('order_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
    
    if (!error) {
      setHistory(prev => ({ ...prev, [orderId]: data || [] }))
    }
    setLoadingHistory(prev => ({ ...prev, [orderId]: false }))
  }

  const handleStatusChange = async (id: string, status: string, oldStatus: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Inicia transação manual (Supabase JS não tem transações multi-tabela fáceis sem RPC, 
    // então faremos em sequência)
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (updateError) {
      toast.error('Erro ao atualizar status')
      return
    }

    // Grava histórico
    await supabase.from('order_history').insert([{
      order_id: id,
      old_status: oldStatus,
      new_status: status,
      changed_by: user?.id || null
    }])

    toast.success('Status atualizado')
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    fetchHistory(id)
  }

  const handleToggleExpand = (id: string) => {
    const isExpanding = expandedId !== id
    setExpandedId(isExpanding ? id : null)
    if (isExpanding && !history[id]) {
      fetchHistory(id)
    }
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    const matchesSearch = 
      o.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_phone.includes(searchTerm)
    
    const orderDate = new Date(o.created_at)
    const matchesStartDate = !startDate || orderDate >= startDate
    const matchesEndDate = !endDate || orderDate <= new Date(endDate.getTime() + 86400000)

    return matchesStatus && matchesSearch && matchesStartDate && matchesEndDate
  })

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

          <div className="bg-card border border-border rounded-2xl p-4 mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por referência, nome ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Data início"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Data fim"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                {(searchTerm || startDate || endDate || statusFilter !== 'all') && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setSearchTerm('')
                      setStartDate(undefined)
                      setEndDate(undefined)
                      setStatusFilter('all')
                    }}
                    title="Limpar filtros"
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
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
                      onClick={() => handleToggleExpand(order.id)}
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
                        <div className="grid gap-6 md:grid-cols-3">
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
                          
                          <div className="space-y-2">
                            <h3 className="font-bold flex items-center gap-2 text-sm">
                              <History className="size-4 text-primary" />
                              Histórico
                            </h3>
                            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
                              {loadingHistory[order.id] ? (
                                <p className="text-xs text-muted-foreground italic">Carregando histórico...</p>
                              ) : !history[order.id] || (history[order.id] as any[]).length === 0 ? (
                                <p className="text-xs text-muted-foreground italic">Nenhuma alteração registrada.</p>
                              ) : (
                                (history[order.id] as any[]).map((h: any, i: number) => (
                                  <div key={i} className="text-xs border-l-2 border-primary/30 pl-3 py-0.5 space-y-1">
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="font-bold text-foreground">
                                        {STATUS_OPTIONS.find(s => s.value === h.new_status)?.label || h.new_status}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {new Date(h.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <p className="text-muted-foreground">
                                      {h.old_status ? `De: ${STATUS_OPTIONS.find(s => s.value === h.old_status)?.label || h.old_status}` : 'Novo pedido'}
                                    </p>
                                  </div>
                                ))
                              )}
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
                              onClick={() => handleStatusChange(order.id, option.value, order.status)}
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
