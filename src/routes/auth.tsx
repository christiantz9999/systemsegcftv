import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Auth } from '@/components/auth/Auth'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

function AuthPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] pt-20 px-4">
        <Auth />
      </main>
      <Footer />
    </div>
  )
}
