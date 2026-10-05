"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Link as LinkIcon, Check } from "lucide-react";

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  label?: string;
  maxSizeMB?: number;
  folder?: "uploads" | "blog" | "projects" | "team" | "services" | "logos" | "testimonials" | (string & {});
}

export default function MediaPicker({
  value,
  onChange,
  onRemove,
  label = "Upload Media",
  maxSizeMB = 4,
  folder = "uploads",
}: MediaPickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToWebP = (file: File): Promise<File> => {
    // If already webp or svg/gif, don't re-compress
    if (file.type === "image/svg+xml" || file.type === "image/gif") {
      return Promise.resolve(file);
    }

    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Failed to get canvas context"));

        // Resize down if too large (max 1600px dimension)
        let { width, height } = img;
        const MAX_DIM = 1600;
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
          0.82
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        // Fallback: upload original file directly if canvas fails
        resolve(file);
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

      const fd = new FormData();
      fd.append("file", fileToUpload);
      fd.append("folder", folder);

      const media = await new Promise<{ url: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/media/upload", true);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          let data: { media?: { url?: string }; error?: string } = {};
          try {
            data = JSON.parse(xhr.responseText);
          } catch {}
          if (xhr.status >= 200 && xhr.status < 300 && data.media?.url) {
            resolve({ url: data.media.url });
          } else if (xhr.status === 401 || xhr.status === 404) {
            reject(new Error("Your session expired. Please sign in again."));
          } else {
            reject(new Error(data.error || `Upload failed (${xhr.status})`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(fd);
      });

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

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setUrlInput("");
    setUrlMode(false);
    setError(null);
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
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="block text-sm font-medium text-white/80">{label}</label>}
        {!value && (
          <button
            type="button"
            onClick={() => setUrlMode(!urlMode)}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
          >
            <LinkIcon size={12} />
            {urlMode ? "Upload File" : "Paste Image URL"}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex justify-between items-start">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
            <X size={16} />
          </button>
        </div>
      )}

      {value ? (
        <div className="relative w-full h-52 rounded-xl border border-white/10 overflow-hidden bg-[#0E1018] group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded preview" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onRemove}
              className="px-3 py-1.5 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium inline-flex items-center gap-1 shadow-md"
            >
              <X size={14} /> Remove Image
            </button>
          </div>
        </div>
      ) : urlMode ? (
        <div className="p-4 rounded-xl border border-white/10 bg-[#0E1018] space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/... or any image URL"
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyUrl();
                }
              }}
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
            >
              <Check size={14} /> Apply
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Paste any direct image link (Unsplash, Cloudinary, AWS S3, etc.)
          </p>
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
