"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common/UserAvatar";
import { ImageCropModal } from "@/components/common/ImageCropModal";

interface ProfilePhotoUploaderProps {
  name?: string | null;
  profilePhoto?: string | null;
  onUpload: (file: File) => Promise<void>;
}

export function ProfilePhotoUploader({ name, profilePhoto, onUpload }: ProfilePhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Read file and open crop modal
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleCropDone = async (croppedFile: File) => {
    setCropSrc(null);
    try {
      setIsUploading(true);
      await onUpload(croppedFile);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="relative">
          <UserAvatar name={name} src={profilePhoto} className="h-14 w-14" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-accent"
            aria-label="Edit profile photo"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{name || "User"}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 h-8 text-xs"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Edit Photo"}
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Crop modal */}
      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          onCropDone={handleCropDone}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </>
  );
}
