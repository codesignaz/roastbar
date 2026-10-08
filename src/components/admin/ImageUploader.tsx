'use client';

import React, { useState, useRef } from 'react';
import { uploadImage, BucketName } from '@/lib/storage';
import { UploadCloud, Loader2, X, CheckCircle2 } from 'lucide-react';

interface ImageUploaderProps {
  bucket: BucketName;
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  bucket,
  currentImageUrl,
  onImageUploaded,
  label = 'Şəkil yükləyin (JPG, PNG, WebP)',
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Yalnız şəkil faylları qəbul olunur (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Şəkil ölçüsü 5MB-dan çox olmamalıdır.');
      return;
    }

    setErrorMessage(null);
    setUploading(true);

    try {
      const { url, error } = await uploadImage(file, bucket);
      if (error) {
        setErrorMessage(error);
      } else if (url) {
        onImageUploaded(url);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Şəkil yükləmək mümkün olmadı.');
    } finally {
      setUploading(false);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-[#473425]">{label}</label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Dropzone container */}
      <div
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[#b87333] bg-[#b87333]/10'
            : 'border-[#ebdcd0] bg-[#faf5ee] hover:border-[#b87333]/60 hover:bg-[#f5ede3]'
        } ${uploading ? 'pointer-events-none opacity-80' : ''}`}
      >
        {currentImageUrl ? (
          <div className="relative group w-full h-40 rounded-xl overflow-hidden bg-[#efe3d5]">
            <img
              src={currentImageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-white gap-2">
              <UploadCloud className="w-4 h-4" />
              <span>Dəyişmək üçün klikləyin və ya faylı atın</span>
            </div>
            <div className="absolute top-2 right-2 bg-emerald-600 text-white p-1 rounded-full text-xs shadow">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#fbf2ea] border border-[#ebdcd0] flex items-center justify-center text-[#8f5222]">
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#b87333]" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>
            <div className="text-xs text-[#5c4a3e]">
              <span className="font-bold text-[#8f5222]">Cihazınızdan seçin</span> və ya buraya
              sürükləyin
            </div>
            <span className="text-[10px] text-[#8c7768]">PNG, JPG, WebP (maks. 5MB)</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/90 rounded-2xl flex flex-col items-center justify-center text-xs text-[#8f5222] gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#b87333]" />
            <span>Supabase Storage-ə yüklənir...</span>
          </div>
        )}
      </div>

      {/* Manual URL input fallback */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="url"
          value={currentImageUrl}
          onChange={(e) => onImageUploaded(e.target.value)}
          placeholder="və ya birbaşa şəkil URL-i yapışdırın (https://...)"
          className="flex-1 text-xs px-3 py-2 rounded-xl bg-white border border-[#ebdcd0] text-[#221710] placeholder-[#9c897b] focus:outline-none focus:border-[#b87333]"
        />
        {currentImageUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onImageUploaded('');
            }}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
            title="Şəkli sil"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {errorMessage && (
        <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
