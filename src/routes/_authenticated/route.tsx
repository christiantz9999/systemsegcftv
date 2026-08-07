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
      let isAdmin = false;
      const { data, error: rpcError } = await supabase.rpc('has_role', {
        _user_id: session.user.id,
        _role: 'admin'
      });
      
      if (rpcError) {
        console.error('Erro ao verificar permissões via RPC:', rpcError);
        // Fallback: tentar ler a tabela diretamente se o RPC falhar (embora RLS possa impedir)
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        isAdmin = !!roleData;
      } else {
        isAdmin = !!data;
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