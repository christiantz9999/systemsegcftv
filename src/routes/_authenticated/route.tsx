import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: location.href,
        },
      })
    }
    
    // Check if user is admin for /admin routes
    if (location.pathname.includes('/admin')) {
      const { data: isAdmin, error: rpcError } = await supabase.rpc('has_role', {
        _user_id: session.user.id,
        _role: 'admin'
      }) as { data: boolean; error: any };
      
      if (rpcError) {
        console.error('Erro ao verificar permissões:', rpcError)
      }
      
      if (!isAdmin) {
        throw redirect({
          to: '/auth',
          search: {
            reason: 'unauthorized_admin',
            redirect: location.href,
          }
        })
      }
    }
  },
  component: () => <Outlet />,
})