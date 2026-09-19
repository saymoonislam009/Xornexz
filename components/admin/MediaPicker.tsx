"use client";

import { useState, useRef } from "react";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  label?: string;
  maxSizeMB?: number;
}

export default function MediaPicker({
  value,
  onChange,
  onRemove,
  label = "Upload Media",
  maxSizeMB = 5,
}: MediaPickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Failed to get canvas context"));

        // Resize if too large (max 1920x1920)
        let { width, height } = img;
        const MAX_DIM = 1920;
        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Canvas toBlob failed"));
            const originalName = file.name.substring(0, file.name.lastIndexOf("."));
            const webpFile = new File([blob], `${originalName || "image"}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(webpFile);
          },
          "image/webp",
          0.85
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image for conversion"));
      };

      img.src = url;
    });
  };

  const handleUpload = async (rawFile: File) => {
    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      if (!rawFile.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      const fileToUpload = await convertToWebP(rawFile);

      if (fileToUpload.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File is too large (max ${maxSizeMB}MB)`);
      }

      const presignRes = await fetch("/api/admin/media/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: fileToUpload.name,
          contentType: fileToUpload.type,
          size: fileToUpload.size,
        }),
      });

      if (!presignRes.ok) {
        const errData = await presignRes.json();
        throw new Error(errData.error || "Failed to get upload URL");
      }

      const { url, key } = await presignRes.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", fileToUpload.type);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(fileToUpload);
      });

      const completeRes = await fetch("/api/admin/media/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (!completeRes.ok) {
        const errData = await completeRes.json();
        throw new Error(errData.error || "Failed to confirm upload");
      }

      const { media } = await completeRes.json();
      onChange(media.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Upload error:", err);
      setError(message);
    } finally {
      setIsUploading(false);
      setProgress(0);
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

      {error && (
        <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex justify-between items-start">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
            <X size={16} />
          </button>
        </div>
      )}

      {value ? (
        <div className="relative w-full h-48 rounded-xl border border-white/10 overflow-hidden bg-[#0E1018] group">
          <Image src={value} alt="Uploaded preview" fill className="object-cover" />
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
          className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer transition-colors relative overflow-hidden ${
            isDragging
              ? "border-[#7C3AED] bg-[#7C3AED]/5"
              : "border-white/20 hover:border-[#7C3AED]/50 bg-[#0E1018]"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0]);
                e.target.value = "";
              }
            }}
            accept="image/*"
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center z-10 w-full max-w-xs">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                <div
                  className="bg-[#7C3AED] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-white/70 font-medium">Processing & Uploading... {progress}%</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <UploadCloud size={24} className="text-white/60" />
              </div>
              <p className="text-sm text-white/70 font-medium mb-1">Click or drag image to upload</p>
              <p className="text-xs text-white/40">Auto-converts to WebP (max. {maxSizeMB}MB)</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
