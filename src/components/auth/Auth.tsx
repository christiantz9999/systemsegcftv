import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, AlertCircle, ShieldAlert } from 'lucide-react'
import { useSearch } from '@tanstack/react-router'

export function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [resendingEmail, setResendingEmail] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'pending' | 'confirmed' | 'denied' | 'error'>('idle')
  const search = useSearch({ from: '/auth' }) as any
  const [accessDenied, setAccessDenied] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user)
    })

    // Se vier de um redirecionamento forçado por falta de permissão admin
    if (search.reason === 'unauthorized_admin') {
      setAccessDenied(true)
      setEmailStatus('denied')
      toast.error('Acesso negado: Você não tem permissões de administrador.')
    }
  }, [search.reason])

  // Check if user is already logged in but maybe not confirmed (though Supabase usually handles this)
  // More importantly, when they enter email, we could potentially check, 
  // but Supabase doesn't expose a public "isEmailConfirmed" for any random email for privacy.
  // However, we can improve the UI to respond to the "Email not confirmed" error more dynamically.

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        toast.success('Cadastro realizado! Verifique seu e-mail para confirmar a conta.')
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setEmailStatus('pending')
            toast.error('E-mail não confirmado. Verifique sua caixa de entrada ou use o botão abaixo para reenviar.')
          } else {
            setEmailStatus('error')
            throw error
          }
          return
        }
        toast.success('Login realizado com sucesso!')
        window.location.href = '/admin/'
      }
    } catch (error: any) {
      setEmailStatus('error')
      toast.error(error.message || 'Erro na autenticação')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Por favor, insira seu e-mail primeiro.')
      return
    }
    
    setResendingEmail(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })
      if (error) throw error
      toast.success('E-mail de confirmação reenviado!')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao reenviar e-mail')
    } finally {
      setResendingEmail(false)
    }
  }

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {currentUser && (
        <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-4 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Logado como: <span className="text-foreground font-bold">{currentUser.email}</span></p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              supabase.auth.signOut().then(() => {
                setCurrentUser(null)
                setEmailStatus('idle')
                toast.success('Deslogado com sucesso')
              })
            }}>
              Sair desta conta
            </Button>
            <Button size="sm" onClick={() => window.location.href = '/admin/'}>
              Tentar acessar Painel
            </Button>
          </div>
        </div>
      )}

      <Card className="bg-card border-border shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-display">
          {isSignUp ? 'Criar Conta Admin' : 'Acesso Administrativo'}
        </CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'Preencha os dados para criar sua conta.' 
            : 'Entre com suas credenciais para gerenciar a loja.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleAuth}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-secondary/50"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full font-bold py-6 text-base" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? 'Cadastrar' : 'Entrar'}
          </Button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem conta? Crie uma'}
          </button>
          
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors mt-2 flex items-center gap-1 justify-center"
          >
            Voltar ao site
          </a>

          {emailStatus === 'pending' && !isSignUp && (
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={resendingEmail}
              className="text-xs text-muted-foreground hover:text-primary transition-colors mt-2 underline underline-offset-4"
            >
              {resendingEmail ? 'Enviando...' : 'Reenviar e-mail de confirmação'}
            </button>
          )}
          {!isSignUp && (
            <button
              type="button"
              onClick={async () => {
                if (!email) {
                  toast.error('Por favor, insira seu e-mail para recuperar a senha.')
                  return
                }
                setIsLoading(true)
                try {
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/reset-password`,
                  })
                  if (error) throw error
                  toast.success('Link de recuperação enviado para o seu e-mail!')
                } catch (error: any) {
                  toast.error(error.message || 'Erro ao enviar link de recuperação')
                } finally {
                  setIsLoading(false)
                }
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors mt-1 underline underline-offset-4"
            >
              Esqueci minha senha
            </button>
          )}


          {emailStatus === 'error' && (
            <a
              href="https://wa.me/5573991969419?text=Ol%C3%A1!%20Estou%20com%20problemas%20para%20acessar%20o%20painel%20administrativo%20da%20SystemSeg."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-4 font-medium flex items-center gap-2 justify-center w-full"
            >
              <AlertCircle className="size-3" />
              Não consigo efetuar o login
            </a>
          )}
        </CardFooter>
      </form>
      </Card>
      
      { (isSignUp || emailStatus === 'pending' || emailStatus === 'denied') && (
        <div className={`rounded-lg p-4 text-sm text-center animate-in fade-in slide-in-from-bottom-2 border ${
          emailStatus === 'denied' 
            ? 'bg-destructive/10 border-destructive/20 text-destructive' 
            : 'bg-blue-500/10 border-blue-500/20 text-blue-200'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            {emailStatus === 'denied' ? <ShieldAlert className="size-4" /> : <AlertCircle className="size-4" />}
            <p className="font-bold">
              {emailStatus === 'denied' ? 'Acesso Restrito' : 'Atenção'}
            </p>
          </div>
          <p>
            {emailStatus === 'denied'
              ? 'Sua conta não possui privilégios de administrador. Entre em contato com o suporte se isso for um erro.'
              : emailStatus === 'pending' 
                ? `O e-mail ${email} ainda não foi confirmado. Verifique sua caixa de entrada e spam.`
                : 'Após o cadastro, verifique sua caixa de entrada e spam. A confirmação pode levar alguns instantes.'}
          </p>
        </div>
      )}
    </div>
  )
}
