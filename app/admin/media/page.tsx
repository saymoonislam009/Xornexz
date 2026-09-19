"use client";

import { useState, useEffect } from "react";
import { Upload, X, File as FileIcon } from "lucide-react";

type Media = {
  id: string;
  url: string;
  filename: string;
  size: number;
  createdAt: string;
};

export default function MediaPage() {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // In a real app, fetch from GET /api/admin/media
    fetch("/api/admin/media")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMediaList(data);
      })
      .catch(() => {});
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.id) {
        setMediaList(prev => [data, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 flex gap-6 h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Media Library</h1>
            <p className="text-muted-foreground mt-1">Manage all uploaded files and images.</p>
          </div>
          <label className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition cursor-pointer">
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload File"}
            <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
          </label>
        </div>

        <div className="flex-1 overflow-auto bg-card border border-border rounded-lg p-4">
          {mediaList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <FileIcon className="w-12 h-12 mb-4 opacity-50" />
              <p>No media found. Upload something!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaList.map((media) => (
                <div
                  key={media.id}
                  onClick={() => setSelectedMedia(media)}
                  className={`relative aspect-square rounded-md overflow-hidden border cursor-pointer hover:opacity-90 transition ${
                    selectedMedia?.id === media.id ? "border-primary ring-2 ring-primary/20" : "border-border"
                  }`}
                >
                  <img src={media.url} alt={media.filename} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedMedia && (
        <div className="w-80 bg-card border border-border rounded-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg">Details</h2>
            <button onClick={() => setSelectedMedia(null)} className="p-1 hover:bg-muted rounded-full">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="aspect-square w-full rounded-md overflow-hidden border border-border mb-4 bg-muted/50">
            <img src={selectedMedia.url} alt={selectedMedia.filename} className="w-full h-full object-contain" />
          </div>
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-xs text-muted-foreground uppercase font-semibold">Filename</label>
              <p className="text-sm font-medium truncate">{selectedMedia.filename}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase font-semibold">Size</label>
              <p className="text-sm">{(selectedMedia.size / 1024).toFixed(2)} KB</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase font-semibold">Uploaded On</label>
              <p className="text-sm">{new Date(selectedMedia.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <button className="w-full py-2 bg-destructive/10 text-destructive rounded-md font-medium hover:bg-destructive/20 transition mt-4">
            Delete File
          </button>
        </div>
      )}
    </div>
  );
}
