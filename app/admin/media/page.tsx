"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Copy, Check, Trash2, ExternalLink, Image as ImageIcon, Plus } from "lucide-react";
import Image from "next/image";
import MediaPicker from "@/components/admin/MediaPicker";

interface MediaItem {
  id: string;
  url: string;
  key: string;
  filename: string;
  size: number;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  createdAt: string;
}

export default function MediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (Array.isArray(data)) setMediaList(data);
    } catch (err) {
      console.error("Failed to fetch media", err);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file from R2 and database?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setSelectedMedia(null);
      fetchMedia();
    } catch (err) {
      alert("Failed to delete media item");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Media Assets</h1>
          <p className="text-gray-400 text-sm mt-1">
            Browse and upload assets hosted on Cloudflare R2 global CDN.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-500/20 transition-all"
        >
          <Plus size={16} /> Upload Asset
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Gallery Grid */}
        <div className="flex-1 w-full bg-[#0B0D14] border border-white/10 rounded-xl p-5 min-h-[500px]">
          {mediaList.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-gray-500">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                <ImageIcon size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium">No media uploaded yet.</p>
              <p className="text-xs text-gray-600 mt-1">Click &quot;Upload Asset&quot; to add images.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {mediaList.map((media) => {
                const isSelected = selectedMedia?.id === media.id;
                return (
                  <div
                    key={media.id}
                    onClick={() => setSelectedMedia(media)}
                    className={`relative aspect-square rounded-xl overflow-hidden border cursor-pointer group bg-[#0E1018] transition-all ${
                      isSelected
                        ? "border-violet-500 ring-2 ring-violet-500/30"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <Image
                      src={media.url}
                      alt={media.filename}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[11px] text-white font-medium truncate w-full">
                        {media.filename}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Media Sidebar */}
        {selectedMedia && (
          <div className="w-full lg:w-80 bg-[#0B0D14] border border-white/10 rounded-xl p-5 space-y-5 flex-shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h2 className="font-semibold text-white text-sm">Asset Metadata</h2>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-[#0E1018]">
              <Image
                src={selectedMedia.url}
                alt={selectedMedia.filename}
                fill
                className="object-contain"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-500 uppercase tracking-wider block font-semibold text-[10px]">
                  Filename
                </span>
                <p className="text-white font-medium break-all mt-0.5">{selectedMedia.filename}</p>
              </div>

              <div>
                <span className="text-gray-500 uppercase tracking-wider block font-semibold text-[10px]">
                  Size
                </span>
                <p className="text-white font-medium mt-0.5">
                  {(selectedMedia.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <div>
                <span className="text-gray-500 uppercase tracking-wider block font-semibold text-[10px]">
                  Format
                </span>
                <p className="text-white font-medium mt-0.5">{selectedMedia.mimeType}</p>
              </div>

              <div>
                <span className="text-gray-500 uppercase tracking-wider block font-semibold text-[10px]">
                  CDN URL
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    readOnly
                    value={selectedMedia.url}
                    className="w-full bg-[#0E1018] border border-white/10 rounded px-2.5 py-1 text-white font-mono text-[11px] truncate focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedMedia.url)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 hover:text-white transition-colors flex-shrink-0"
                    title="Copy URL"
                  >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex gap-2">
              <a
                href={selectedMedia.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink size={14} /> Open
              </a>
              <button
                onClick={() => handleDelete(selectedMedia.id)}
                disabled={isDeleting}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium transition-colors disabled:opacity-50"
                title="Delete Media"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0D14] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Upload New Asset</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <MediaPicker
              onChange={(_url) => {
                setShowUploadModal(false);
                fetchMedia();
              }}
              onRemove={() => {}}
              label="Select or Drag Image to Upload"
            />
          </div>
        </div>
      )}
    </div>
  );
}
