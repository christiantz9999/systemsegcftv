import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Plus, Trash2, Tag, Search, Pencil, Check, X } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/admin/categorias')({
  component: AdminCategories,
})

function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const makeSlug = (value: string) =>
    value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleUpdate = async (id: string) => {
    const name = editingName.trim()
    if (!name) return
    const { error } = await supabase
      .from('categories')
      .update({ name, slug: makeSlug(name) })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao atualizar categoria')
      return
    }
    toast.success('Categoria atualizada')
    setEditingId(null)
    setEditingName('')
    fetchCategories()
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) {
      toast.error('Erro ao buscar categorias')
    } else {
      setCategories(data || [])
    }
    setIsLoading(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    const slug = newCategoryName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-')
    
    const { error } = await supabase
      .from('categories')
      .insert([{ name: newCategoryName, slug }])
    
    if (error) {
      toast.error('Erro ao criar categoria')
    } else {
      toast.success('Categoria criada com sucesso')
      setNewCategoryName('')
      fetchCategories()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? Os produtos associados ficarão sem categoria.')) return

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) {
      toast.error('Erro ao excluir categoria')
    } else {
      toast.success('Categoria excluída com sucesso')
      fetchCategories()
    }
  }

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-display">Gerenciar Categorias</h1>
              <p className="text-muted-foreground">Organize seus produtos por categorias.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold mb-6">Nova Categoria</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome da Categoria</label>
                    <Input 
                      placeholder="Ex: Câmeras IP" 
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full font-bold">
                    <Plus className="size-5 mr-2" />
                    Criar Categoria
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar categorias..." 
                  className="pl-10 py-6 bg-secondary/30"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-secondary/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {isLoading ? (
                        <tr>
                          <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                            Carregando categorias...
                          </td>
                        </tr>
                      ) : filteredCategories.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                            Nenhuma categoria encontrada.
                          </td>
                        </tr>
                      ) : (
                        filteredCategories.map(cat => (
                          <tr key={cat.id} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-4 sm:px-6 py-4">
                              {editingId === cat.id ? (
                                <form
                                  onSubmit={(e) => { e.preventDefault(); handleUpdate(cat.id) }}
                                  className="flex items-center gap-2"
                                >
                                  <Tag className="size-5 text-primary shrink-0" />
                                  <Input
                                    autoFocus
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="h-9"
                                  />
                                </form>
                              ) : (
                                <div className="flex items-center gap-3 min-w-0">
                                  <Tag className="size-5 text-primary shrink-0" />
                                  <span className="font-bold truncate">{cat.name}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {editingId === cat.id ? (
                                  <>
                                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" onClick={() => handleUpdate(cat.id)} title="Salvar">
                                      <Check className="size-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => { setEditingId(null); setEditingName('') }} title="Cancelar">
                                      <X className="size-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button variant="ghost" size="icon" onClick={() => { setEditingId(cat.id); setEditingName(cat.name) }} title="Editar">
                                      <Pencil className="size-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(cat.id)} title="Excluir">
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
