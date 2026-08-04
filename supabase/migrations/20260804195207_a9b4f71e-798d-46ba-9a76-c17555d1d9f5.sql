
CREATE TABLE public.order_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    old_status text,
    new_status text NOT NULL,
    changed_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now() NOT NULL
);

GRANT SELECT, INSERT ON public.order_history TO authenticated;
GRANT ALL ON public.order_history TO service_role;

ALTER TABLE public.order_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all order history"
ON public.order_history
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert order history"
ON public.order_history
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
