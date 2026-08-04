import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [resendingEmail, setResendingEmail] = useState(false)

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
            toast.error('E-mail não confirmado. Verifique sua caixa de entrada ou use o botão abaixo para reenviar.')
          } else {
            throw error
          }
          return
        }
        toast.success('Login realizado com sucesso!')
        window.location.href = '/admin'
      }
    } catch (error: any) {
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
    <Card className="w-full max-w-md mx-auto bg-card border-border shadow-2xl">
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
          {!isSignUp && (
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={resendingEmail}
              className="text-xs text-muted-foreground hover:text-primary transition-colors mt-2 underline underline-offset-4"
            >
              {resendingEmail ? 'Enviando...' : 'Reenviar e-mail de confirmação'}
            </button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
