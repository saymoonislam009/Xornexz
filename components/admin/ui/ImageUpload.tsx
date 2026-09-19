import { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, onRemove, label = "Upload Image" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Future implementation: use /api/admin/media/presign for R2 uploads
      // For now, mock upload for preview
      setTimeout(() => {
        const fakeUrl = URL.createObjectURL(file);
        onChange(fakeUrl);
        setIsUploading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-white/80 mb-2">{label}</label>}
      
      {value ? (
        <div className="relative w-full h-48 rounded-xl border border-white/10 overflow-hidden bg-[#0E1018] group">
          <Image 
            src={value} 
            alt="Uploaded image" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              type="button"
              onClick={onRemove}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer transition-colors ${
            isDragging ? 'border-[#7C3AED] bg-[#7C3AED]/5' : 'border-white/20 hover:border-[#7C3AED]/50 bg-[#0E1018]'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            accept="image/*" 
            className="hidden" 
          />
          
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud size={24} className="text-white/60" />
            )}
          </div>
          <p className="text-sm text-white/70 font-medium mb-1">
            {isUploading ? 'Uploading...' : 'Click or drag image to upload'}
          </p>
          <p className="text-xs text-white/40">SVG, PNG, JPG or GIF (max. 5MB)</p>
        </div>
      )}
    </div>
  );
}
