-- Seed Categories
INSERT INTO public.categories (name, slug)
VALUES 
    ('Câmeras', 'cameras'),
    ('Alarmes', 'alarmes'),
    ('Cerca Elétrica', 'cerca-eletrica'),
    ('Interfonia', 'interfonia'),
    ('Controle de Acesso', 'controle-de-acesso')
ON CONFLICT (slug) DO NOTHING;

-- Get Category IDs
DO $$
DECLARE
    cat_cameras uuid;
    cat_alarmes uuid;
    cat_cercas uuid;
BEGIN
    SELECT id INTO cat_cameras FROM public.categories WHERE slug = 'cameras';
    SELECT id INTO cat_alarmes FROM public.categories WHERE slug = 'alarmes';
    SELECT id INTO cat_cercas FROM public.categories WHERE slug = 'cerca-eletrica';

    -- Seed Products
    INSERT INTO public.products (name, description, price, category_id, stock_quantity, image_url, is_active)
    VALUES 
        ('Câmera Speed Dome Intelbras', 'Câmera PTZ profissional com zoom óptico de 30x e visão noturna de 150m.', 1250.00, cat_cameras, 10, 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&q=80&w=800', true),
        ('Kit Alarme Monitorado', 'Central de alarme com 4 sensores de presença e 2 controles remotos.', 850.00, cat_alarmes, 5, 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800', true),
        ('Eletrificador de Cerca High Power', 'Eletrificador para cercas elétricas de até 10.000 metros lineares.', 450.00, cat_cercas, 15, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800', true)
    ON CONFLICT DO NOTHING;
END$$;
