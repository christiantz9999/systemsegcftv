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
    if (location.pathname.startsWith('/admin')) {
      const { data: isAdmin } = await supabase.rpc('has_role', {
        _user_id: session.user.id,
        _role: 'admin'
      })
      
      if (!isAdmin) {
        throw redirect({
          to: '/',
        })
      }
    }
  },
  component: () => <Outlet />,
})
