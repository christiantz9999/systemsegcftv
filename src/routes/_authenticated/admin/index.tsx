import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { LayoutDashboard, Package, Tag, Settings, LogOut } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 space-y-2">
              <nav className="space-y-1">
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold transition-all"
                >
                  <LayoutDashboard className="size-5" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/produtos"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-all"
                >
                  <Package className="size-5" />
                  Produtos
                </Link>
                <Link
                  to="/admin/categorias"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-all"
                >
                  <Tag className="size-5" />
                  Categorias
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all text-left"
                >
                  <LogOut className="size-5" />
                  Sair
                </button>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Total de Produtos</h3>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Categorias Ativas</h3>
                  <p className="text-3xl font-bold">4</p>
                </div>
                <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Estoque Crítico</h3>
                  <p className="text-3xl font-bold text-destructive">2</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-bold">Gerenciamento Rápido</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link 
                    to="/admin/produtos" 
                    className="p-6 rounded-xl border border-border hover:border-primary/50 transition-all group"
                  >
                    <Package className="size-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">Novo Produto</h3>
                    <p className="text-sm text-muted-foreground">Adicione um novo item ao catálogo da loja.</p>
                  </Link>
                  <Link 
                    to="/admin/categorias" 
                    className="p-6 rounded-xl border border-border hover:border-primary/50 transition-all group"
                  >
                    <Tag className="size-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">Categorias</h3>
                    <p className="text-sm text-muted-foreground">Organize seus produtos por grupos.</p>
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
