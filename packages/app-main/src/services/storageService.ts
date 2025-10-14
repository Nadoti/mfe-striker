import { supabase } from '@/lib/supabase';
import type { TransactionAttachment } from '@/types/transaction';

const BUCKET_NAME = 'transaction-attachments';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export const StorageService = {
  validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'Arquivo muito grande. Máximo: 5MB',
      };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Formato não suportado. Use: JPG, PNG, WEBP ou PDF',
      };
    }

    return { valid: true };
  },

  async uploadFile(file: File): Promise<TransactionAttachment> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw new Error('Erro ao fazer upload do arquivo');
    }

    const { data: urlData, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(data.path, 31536000);

    if (urlError || !urlData) {
      throw new Error('Erro ao gerar URL do arquivo');
    }

    return {
      name: file.name,
      url: urlData.signedUrl,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };
  },

  async uploadMultipleFiles(files: File[]): Promise<TransactionAttachment[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  },

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filePath = this.extractFilePathFromUrl(fileUrl);

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting file:', error);
        throw new Error('Erro ao deletar arquivo');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Erro ao deletar arquivo');
    }
  },

  async deleteMultipleFiles(attachments: TransactionAttachment[]): Promise<void> {
    const deletePromises = attachments.map((att) => this.deleteFile(att.url));
    await Promise.allSettled(deletePromises);
  },

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) {
      return '🖼️';
    }
    if (fileType === 'application/pdf') {
      return '📄';
    }
    return '📎';
  },

  async getSignedUrl(filePath: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 31536000);

    if (error || !data) {
      throw new Error('Erro ao gerar URL assinada');
    }

    return data.signedUrl;
  },

  extractFilePathFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const bucketIndex = pathParts.indexOf(BUCKET_NAME);
      if (bucketIndex !== -1) {
        return pathParts.slice(bucketIndex + 1).join('/');
      }
      return pathParts.slice(-2).join('/');
    } catch (error) {
      console.error('Error extracting file path:', error);
      throw new Error('URL de arquivo inválida');
    }
  },
};

