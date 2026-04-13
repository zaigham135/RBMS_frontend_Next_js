"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { X, Check, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropModalProps {
  imageSrc: string;
  onCropDone: (croppedFile: File) => void;
  onCancel: () => void;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise(resolve => { image.onload = resolve; });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0, 0,
    pixelCrop.width, pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(blob => {
      resolve(new File([blob!], "profile-photo.jpg", { type: "image/jpeg" }));
    }, "image/jpeg", 0.9);
  });
}

export function ImageCropModal({ imageSrc, onCropDone, onCancel }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const file = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(file);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1e293b] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#334155]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9]">Crop Photo</h3>
          <button type="button" onClick={onCancel} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative h-72 bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-[#334155]">
          <div className="flex items-center gap-3">
            <ZoomOut className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full accent-blue-600 cursor-pointer"
            />
            <ZoomIn className="h-4 w-4 text-gray-400 shrink-0" />
          </div>
          <p className="text-center text-[11px] text-gray-400 dark:text-[#64748b] mt-2">Drag to reposition · Scroll to zoom</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-5 py-4">
          <button type="button" onClick={onCancel}
            className="rounded-xl border border-gray-200 dark:border-[#334155] px-4 py-2 text-sm font-medium text-gray-600 dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleDone} disabled={isProcessing}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors">
            <Check className="h-4 w-4" />
            {isProcessing ? "Processing..." : "Apply Crop"}
          </button>
        </div>
      </div>
    </div>
  );
}
