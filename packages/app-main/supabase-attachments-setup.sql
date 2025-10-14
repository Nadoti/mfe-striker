-- ============================================
-- ADICIONAR COLUNA DE ANEXOS NA TABELA TRANSACTIONS
-- ============================================

ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Adicionar comentário descritivo
COMMENT ON COLUMN transactions.attachments IS 'Array de anexos (recibos, notas fiscais) em formato JSON: [{ name, url, type, size, uploadedAt }]';

-- ============================================
-- CRIAR BUCKET DE STORAGE PARA ANEXOS
-- ============================================

-- Execute este comando no painel do Supabase em Storage > Policies
-- Ou via SQL Editor:

INSERT INTO storage.buckets (id, name, public)
VALUES ('transaction-attachments', 'transaction-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- POLÍTICAS DE STORAGE (RLS)
-- ============================================

-- Permitir que usuários façam upload de seus próprios anexos
CREATE POLICY "Users can upload their own attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'transaction-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que usuários vejam seus próprios anexos
CREATE POLICY "Users can view their own attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'transaction-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que usuários deletem seus próprios anexos
CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'transaction-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- EXEMPLO DE ESTRUTURA DO JSONB attachments
-- ============================================

/*
[
  {
    "name": "recibo-compra.pdf",
    "url": "https://supabase.co/storage/v1/object/public/transaction-attachments/user-id/file-id.pdf",
    "type": "application/pdf",
    "size": 245632,
    "uploadedAt": "2025-01-15T10:30:00Z"
  },
  {
    "name": "nota-fiscal.jpg",
    "url": "https://supabase.co/storage/v1/object/public/transaction-attachments/user-id/file-id.jpg",
    "type": "image/jpeg",
    "size": 512000,
    "uploadedAt": "2025-01-15T10:31:00Z"
  }
]
*/

-- ============================================
-- FUNÇÃO AUXILIAR: Limpar anexos órfãos
-- ============================================

-- Esta função pode ser executada periodicamente para limpar arquivos órfãos
CREATE OR REPLACE FUNCTION cleanup_orphaned_attachments()
RETURNS void AS $$
BEGIN
  -- Aqui você pode adicionar lógica para deletar arquivos do storage
  -- que não estão mais referenciados em nenhuma transação
  RAISE NOTICE 'Cleanup function placeholder - implement deletion logic';
END;
$$ LANGUAGE plpgsql;


