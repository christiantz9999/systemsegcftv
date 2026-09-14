ALTER TABLE public.order_history DROP CONSTRAINT IF EXISTS order_history_order_id_fkey;
ALTER TABLE public.order_history ADD CONSTRAINT order_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
CREATE POLICY "Admins can delete order history" ON public.order_history FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
GRANT DELETE ON public.order_history TO authenticated;