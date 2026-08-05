import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Plus, Pencil, Trash2, Package, Search } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/admin/produtos')({
  component: AdminProducts,
})

function AdminProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
    
    if (error) {
      toast.error('Erro ao buscar produtos')
    } else {
      setProducts(data || [])
    }
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) {
      toast.error('Erro ao excluir produto')
    } else {
      toast.success('Produto excluído com sucesso')
      fetchProducts()
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-display">Gerenciar Produtos</h1>
              <p className="text-muted-foreground">Adicione, edite ou remova produtos da sua loja.</p>
            </div>
            <Button asChild className="font-bold">
              <Link to="/admin/produtos/novo">
                <Plus className="size-5 mr-2" />
                Novo Produto
              </Link>
            </Button>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar produtos..." 
              className="pl-10 py-6 text-lg bg-secondary/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Produto</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Preço</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Estoque</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        Carregando produtos...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        Nenhum produto encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                              {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="size-full object-cover" />
                              ) : (
                                <Package className="size-full p-2 text-muted-foreground" />
                              )}
                            </div>
                            <span className="font-bold">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {product.categories?.name || 'Sem categoria'}
                        </td>
                        <td className="px-6 py-4 font-display font-bold text-primary">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock_quantity <= 5 ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'}`}>
                            {product.stock_quantity} un
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.is_active ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                            {product.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => navigate({ 
                                to: "/admin/produtos/$productId", 
                                params: { productId: product.id } 
                              })}
                              className="cursor-pointer hover:bg-secondary/50"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(product.id)}>
                              <Trash2 className="size-4" />
                            </Button>
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
      <Footer />
    </div>
  )
}
