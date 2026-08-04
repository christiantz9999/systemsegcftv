import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { ChevronLeft, Save, Loader2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/produtos/$productId')({
  component: EditProductPage,
})

function EditProductPage() {
  const { productId } = useParams({ from: '/_authenticated/admin/produtos/$productId' })
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock_quantity: '0',
    image_url: '',
    is_active: true
  })

  useEffect(() => {
    fetchData()
  }, [productId])

  const fetchData = async () => {
    setIsFetching(true)
    const { data: catData } = await supabase.from('categories').select('*').order('name')
    setCategories(catData || [])

    const { data: prodData, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (error) {
      toast.error('Erro ao carregar produto')
      navigate({ to: '/admin/produtos' })
    } else if (prodData) {
      setFormData({
        name: prodData.name,
        description: prodData.description || '',
        price: prodData.price.toString(),
        category_id: prodData.category_id || '',
        stock_quantity: prodData.stock_quantity.toString(),
        image_url: prodData.image_url || '',
        is_active: prodData.is_active
      })
    }
    setIsFetching(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...formData,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity),
          category_id: formData.category_id || null
        })
        .eq('id', productId)

      if (error) throw error
      
      toast.success('Produto atualizado com sucesso!')
      navigate({ to: '/admin/produtos' })
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar produto')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/admin/produtos" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
              <ChevronLeft className="size-4 mr-1" />
              Voltar para Lista
            </Link>
            <h1 className="text-3xl font-bold font-display">Editar Produto</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description"
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input 
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque</Label>
                  <Input 
                    id="stock"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, category_id: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL da Imagem</Label>
                <Input 
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/20">
                <div className="space-y-0.5">
                  <Label>Produto Ativo</Label>
                  <p className="text-xs text-muted-foreground">O produto aparecerá na loja se estiver ativo.</p>
                </div>
                <Switch 
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
            </div>

            <Button type="submit" className="w-full font-bold py-6 text-lg" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}
              Salvar Alterações
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
