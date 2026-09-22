"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function ImageUpload({ value, onChange, folder = "uploads", placeholder = "Upload Image", recommendedSize = "" }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPEG, PNG, WebP)");
      return;
    }

    // Check size limit (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size is 5MB.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const clearImage = () => {
    onChange("");
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 group" style={{ minHeight: "120px" }}>
          <div className="relative w-full h-32 flex items-center justify-center">
            {/* Try to use Next/Image but fallback gracefully if URL is external */}
            {value.startsWith("/") ? (
              <Image src={value} alt="Uploaded preview" fill className="object-contain" sizes="300px" />
            ) : (
              <img src={value} alt="Uploaded preview" className="max-w-full max-h-full object-contain" />
            )}
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-white/90 text-slate-700 hover:text-red-600 p-1.5 rounded-md shadow-sm border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove Image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex flex-col items-center justify-center py-8 px-4 text-center group relative overflow-hidden"
        >
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
              <Loader2 className="h-6 w-6 text-crimson animate-spin mb-2" />
              <span className="text-sm font-medium text-slate-700">Uploading...</span>
            </div>
          )}
          <div className="h-10 w-10 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-crimson/30 group-hover:text-crimson transition-all">
            <Upload className="h-5 w-5 text-slate-400 group-hover:text-crimson transition-colors" />
          </div>
          <p className="text-sm font-medium text-slate-700 mb-1">{placeholder}</p>
          <p className="text-xs text-slate-400 mb-1">Click to browse or drag and drop</p>
          {recommendedSize && (
            <p className="text-xs text-crimson/80 font-medium bg-crimson/5 px-2 py-0.5 rounded mt-1">{recommendedSize}</p>
          )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <input 
            type="text" 
            className="form-input text-xs w-full rounded-md border border-slate-200 py-1.5 px-3 bg-slate-50 text-slate-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            title="Image URL (editable)"
          />
        </div>
      )}
    </div>
  );
}
