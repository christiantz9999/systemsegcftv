import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { supabase } from '@/integrations/supabase/client'
import { suggestContactReply } from '@/lib/ai-reply.functions'
import { formatPhone } from '@/lib/contact-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowLeft, MessageSquare, Search, Sparkles, Check, Trash2, Send } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/admin/mensagens')({
  head: () => ({
    meta: [
      { title: 'Mensagens do site | Painel SystemSeg' },
      { name: 'description', content: 'Mensagens recebidas pelo formulário de contato da SystemSeg.' },
      { property: 'og:title', content: 'Mensagens do site | Painel SystemSeg' },
      { property: 'og:description', content: 'Mensagens recebidas pelo formulário de contato da SystemSeg.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: AdminMessages,
})

type ContactMessage = {
  id: string
  name: string
  phone: string
  address: string | null
  city: string | null
  services: string[]
  description: string | null
  status: string
  ai_suggestion: string | null
  approved_reply: string | null
  created_at: string
}

const STATUS_LABEL: Record<string, string> = {
  new: 'Nova',
  answered: 'Respondida',
  archived: 'Arquivada',
}

function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const suggest = useServerFn(suggestContactReply)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) toast.error('Erro ao carregar mensagens')
    else setMessages((data || []) as ContactMessage[])
    setIsLoading(false)
  }

  const handleGenerate = async (m: ContactMessage) => {
    setGeneratingId(m.id)
    try {
      const result = await suggest({
        data: {
          nome: m.name,
          telefone: m.phone,
          cidade: m.city || '',
          servicos: m.services || [],
          descricao: m.description || '',
        },
      })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      setDraft(result.suggestion)
      const { error } = await supabase
        .from('contact_messages')
        .update({ ai_suggestion: result.suggestion })
        .eq('id', m.id)
      if (error) {
        toast.error('A sugestão foi gerada, mas não pôde ser salva.')
        return
      }
      setMessages((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, ai_suggestion: result.suggestion } : item)),
      )
      toast.success('Sugestão gerada. Revise antes de enviar.')
    } finally {
      setGeneratingId(null)
    }
  }

  const handleApprove = async (m: ContactMessage) => {
    const reply = draft.trim()
    if (!reply) {
      toast.error('Escreva ou gere uma resposta antes de aprovar.')
      return
    }
    const { error } = await supabase
      .from('contact_messages')
      .update({ approved_reply: reply, status: 'answered' })
      .eq('id', m.id)
    if (error) {
      toast.error('Erro ao salvar a resposta')
      return
    }
    setMessages((prev) =>
      prev.map((item) =>
        item.id === m.id ? { ...item, approved_reply: reply, status: 'answered' } : item,
      ),
    )
    toast.success('Resposta aprovada e pronta para envio')
  }

  const handleSend = (m: ContactMessage) => {
    const reply = draft.trim()
    if (!reply) {
      toast.error('Escreva ou gere uma resposta antes de enviar.')
      return
    }
    if (m.approved_reply !== reply) {
      toast.error('Aprove esta versão da resposta antes de enviar.')
      return
    }
    const phone = m.phone.replace(/\D/g, '')
    const destination = phone.startsWith('55') ? phone : `55${phone}`
    window.open(`https://wa.me/${destination}?text=${encodeURIComponent(reply)}`, '_blank', 'noopener,noreferrer')
  }

  const handleStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id)
    if (error) toast.error('Erro ao atualizar situação')
    else fetchMessages()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apagar esta mensagem? Esta ação não pode ser desfeita.')) return
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (error) toast.error('Erro ao apagar mensagem')
    else {
      toast.success('Mensagem apagada')
      setOpenId(null)
      fetchMessages()
    }
  }

  const filtered = messages.filter((m) => {
    const term = search.trim().toLowerCase()
    const matchTerm =
      !term ||
      m.name.toLowerCase().includes(term) ||
      m.phone.includes(term.replace(/\D/g, '')) ||
      (m.city || '').toLowerCase().includes(term) ||
      (m.description || '').toLowerCase().includes(term)
    const matchStatus = statusFilter === 'all' || m.status === statusFilter
    return matchTerm && matchStatus
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
            <div className="min-w-0">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" /> Voltar ao painel
              </Link>
              <h1 className="mt-2 flex items-center gap-2 truncate text-2xl font-bold sm:text-3xl">
                <MessageSquare className="size-6 shrink-0 text-primary" /> Mensagens do site
              </h1>
            </div>
            <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-semibold">
              {filtered.length}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, telefone, cidade ou texto"
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              aria-label="Filtrar por situação"
            >
              <option value="all">Todas</option>
              <option value="new">Novas</option>
              <option value="answered">Respondidas</option>
              <option value="archived">Arquivadas</option>
            </select>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground">Carregando mensagens...</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
              Nenhuma mensagem encontrada.
            </div>
          ) : (
            <ul className="space-y-4">
              {filtered.map((m) => {
                const open = openId === m.id
                return (
                  <li key={m.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-lg font-bold">{m.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPhone(m.phone)} · {m.city || 'Cidade não informada'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(m.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                        {STATUS_LABEL[m.status] ?? m.status}
                      </span>
                    </div>

                    {m.services?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.services.map((s) => (
                          <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {m.description && (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                        {m.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setOpenId(open ? null : m.id)
                          setDraft(m.approved_reply || m.ai_suggestion || '')
                        }}
                      >
                        {open ? 'Fechar resposta' : 'Responder'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatus(m.id, m.status === 'archived' ? 'new' : 'archived')}
                      >
                        {m.status === 'archived' ? 'Reabrir' : 'Arquivar'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(m.id)}
                      >
                        <Trash2 className="size-4" /> Apagar
                      </Button>
                    </div>

                    {open && (
                      <div className="mt-4 space-y-3 rounded-xl border border-border bg-background p-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleGenerate(m)}
                          disabled={generatingId === m.id}
                        >
                          <Sparkles className="size-4" />
                          {generatingId === m.id ? 'Gerando sugestão...' : 'Gerar sugestão com IA'}
                        </Button>
                        <textarea
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          rows={7}
                          placeholder="A sugestão da IA aparece aqui para você revisar e editar antes de enviar."
                          className="w-full rounded-lg border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" onClick={() => handleApprove(m)}>
                            <Check className="size-4" /> Aprovar resposta
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSend(m)}
                            disabled={!draft.trim() || m.approved_reply !== draft.trim()}
                          >
                            <Send className="size-4" /> Enviar no WhatsApp
                          </Button>
                        </div>
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
