-- Permitir que qualquer pessoa veja as imagens (bucket público)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Permitir que administradores façam upload de imagens
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products' AND
  public.has_role(auth.uid(), 'admin')
);

-- Permitir que administradores atualizem imagens
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'products' AND
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'products' AND
  public.has_role(auth.uid(), 'admin')
);

-- Permitir que administradores excluam imagens
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'products' AND
  public.has_role(auth.uid(), 'admin')
);