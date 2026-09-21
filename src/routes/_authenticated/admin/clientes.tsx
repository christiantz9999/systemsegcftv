import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowLeft, Users, Search, Plus, Pencil, Trash2, Check, X, Phone } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/admin/clientes')({
  head: () => ({
    meta: [
      { title: 'Clientes | Painel SystemSeg' },
      { name: 'description', content: 'Cadastro de clientes e histórico de pedidos da SystemSeg.' },
      { property: 'og:title', content: 'Clientes | Painel SystemSeg' },
      { property: 'og:description', content: 'Cadastro de clientes e histórico de pedidos da SystemSeg.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: AdminCustomers,
})

type Customer = {
  id: string
  name: string
  phone: string
  email: string | null
  address: string | null
  city: string | null
  notes: string | null
  created_at: string
}

type Order = {
  id: string
  reference: string
  customer_phone: string
  total: number
  status: string
  created_at: string
}

type OrderHistory = {
  id: string
  order_id: string
  old_status: string | null
  new_status: string
  created_at: string
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

const emptyForm = { name: '', phone: '', email: '', address: '', city: '', notes: '' }

const PAGE_SIZE = 10

function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [history, setHistory] = useState<OrderHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setIsLoading(true)
    const [c, o, h] = await Promise.all([
      supabase.from('customers').select('*').order('name'),
      supabase.from('orders').select('id, reference, customer_phone, total, status, created_at'),
      supabase.from('order_history').select('*').order('created_at', { ascending: false }),
    ])
    if (c.error || o.error || h.error) toast.error('Erro ao carregar dados')
    setCustomers((c.data || []) as Customer[])
    setOrders((o.data || []) as Order[])
    setHistory((h.data || []) as OrderHistory[])
    setIsLoading(false)
  }

  const digits = (value: string) => value.replace(/\D/g, '')

  const handleSave = async () => {
    if (form.name.trim().length < 3) {
      toast.error('Informe o nome completo do cliente.')
      return
    }
    if (digits(form.phone).length < 10) {
      toast.error('Informe um telefone válido com DDD.')
      return
    }
    const payload = {
      name: form.name.trim(),
      phone: digits(form.phone),
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      notes: form.notes.trim() || null,
    }
    const duplicate = customers.some(
      (customer) => customer.id !== editingId && digits(customer.phone) === payload.phone,
    )
    if (duplicate) {
      toast.error('Já existe um cliente cadastrado com este telefone.')
      return
    }
    const { error } = editingId
      ? await supabase.from('customers').update(payload).eq('id', editingId)
      : await supabase.from('customers').insert(payload)

    if (error) {
      toast.error('Erro ao salvar cliente')
      return
    }
    toast.success(editingId ? 'Cliente atualizado' : 'Cliente cadastrado')
    setForm(emptyForm)
    setEditingId(null)
    fetchAll()
  }

  const handleEdit = (c: Customer) => {
    setEditingId(c.id)
    setForm({
      name: c.name,
      phone: c.phone,
      email: c.email || '',
      address: c.address || '',
      city: c.city || '',
      notes: c.notes || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este cliente? Os pedidos já registrados serão mantidos.')) return
    const { error } = await supabase.from('customers').delete().eq('id', id)
    if (error) toast.error('Erro ao excluir cliente')
    else {
      toast.success('Cliente excluído')
      fetchAll()
    }
  }

  const ordersOf = (phone: string) => orders.filter((o) => digits(o.customer_phone) === digits(phone))

  const filtered = customers.filter((c) => {
    const term = search.trim().toLowerCase()
    return (
      !term ||
      c.name.toLowerCase().includes(term) ||
      c.phone.includes(digits(term)) ||
      (c.city || '').toLowerCase().includes(term)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="min-w-0">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Voltar ao painel
            </Link>
            <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <Users className="size-6 shrink-0 text-primary" /> Clientes
            </h1>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-lg font-bold">
              {editingId ? 'Editar cliente' : 'Cadastrar novo cliente'}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome completo"
              />
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Telefone com DDD"
                inputMode="tel"
              />
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="E-mail (opcional)"
                type="email"
              />
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Cidade"
              />
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Endereço"
                className="sm:col-span-2"
              />
              <Input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Observações"
                className="sm:col-span-2"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSave}>
                {editingId ? <Check className="size-4" /> : <Plus className="size-4" />}
                {editingId ? 'Salvar alterações' : 'Cadastrar cliente'}
              </Button>
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setForm(emptyForm)
                  }}
                >
                  <X className="size-4" /> Cancelar
                </Button>
              )}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Buscar cliente por nome, telefone ou cidade"
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <p className="text-muted-foreground">Carregando clientes...</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
              Nenhum cliente cadastrado ainda.
            </div>
          ) : (
            <ul className="space-y-4">
              {filtered.map((c) => {
                const list = ordersOf(c.phone)
                const open = openId === c.id
                return (
                  <li key={c.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-lg font-bold">{c.name}</p>
                         <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="size-3.5 shrink-0" /> {c.phone}
                          {c.city ? ` · ${c.city}` : ''}
                        </p>
                        {c.email && <p className="truncate text-sm text-muted-foreground">{c.email}</p>}
                        {c.address && <p className="text-sm text-muted-foreground">{c.address}</p>}
                        {c.notes && <p className="mt-1 text-sm text-muted-foreground">{c.notes}</p>}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="icon" aria-label="Editar cliente" onClick={() => handleEdit(c)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Excluir cliente"
                          className="text-destructive"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Button variant="outline" size="sm" onClick={() => setOpenId(open ? null : c.id)}>
                        {open ? 'Ocultar pedidos' : `Ver pedidos (${list.length})`}
                      </Button>
                      <a
                        href={`https://wa.me/${digits(c.phone).startsWith('55') ? digits(c.phone) : `55${digits(c.phone)}`}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Falar no WhatsApp
                      </a>
                    </div>

                    {open && (
                      <div className="mt-4 space-y-3">
                        {list.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            Este cliente ainda não possui pedidos registrados.
                          </p>
                        ) : (
                          list.map((o) => {
                            const events = history.filter((h) => h.order_id === o.id)
                            return (
                              <div key={o.id} className="rounded-xl border border-border bg-background p-4">
                                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                                  <div className="min-w-0">
                                    <p className="truncate font-semibold">Pedido {o.reference}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(o.created_at).toLocaleString('pt-BR')}
                                    </p>
                                  </div>
                                  <div className="shrink-0 text-right">
                                    <p className="font-bold">
                                      {Number(o.total).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                      })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {STATUS_LABEL[o.status] ?? o.status}
                                    </p>
                                  </div>
                                </div>
                                {events.length > 0 && (
                                  <ul className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                                    {events.map((e) => (
                                      <li key={e.id}>
                                        {new Date(e.created_at).toLocaleString('pt-BR')} ·{' '}
                                        {e.old_status ? `${STATUS_LABEL[e.old_status] ?? e.old_status} → ` : ''}
                                        {STATUS_LABEL[e.new_status] ?? e.new_status}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )
                          })
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
