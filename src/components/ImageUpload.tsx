import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (base64: string) => void;
  className?: string;
  accept?: string;
}

export default function ImageUpload({ onUpload, className = '', accept = 'image/*' }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to WebP or JPEG for smaller size
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file);
        onUpload(compressed);
      } else {
        // For non-images (like small videos), we still use Base64 but keep the size limit
        const limit = 5 * 1024 * 1024; // Lowering video limit to 5MB for stability
        if (file.size > limit) {
          alert('Arquivo muito grande. Para vídeos, use links do YouTube ou Drive para melhor performance.');
          setIsProcessing(false);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          onUpload(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Erro ao processar arquivo.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <button
        type="button"
        disabled={isProcessing}
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#FF2D7A]/10 text-[#FF2D7A] rounded-lg text-xs font-bold hover:bg-[#FF2D7A]/20 transition-all border border-[#FF2D7A]/20 disabled:opacity-50"
      >
        {isProcessing ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Upload className="w-3.5 h-3.5" />
        )}
        {isProcessing ? 'Processando...' : 'Fazer Upload'}
      </button>
    </div>
  );
}
