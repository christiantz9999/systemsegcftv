ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';
UPDATE public.orders SET status = 'pending' WHERE status = 'pendente';
