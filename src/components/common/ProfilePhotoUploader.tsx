"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common/UserAvatar";

interface ProfilePhotoUploaderProps {
  name?: string | null;
  profilePhoto?: string | null;
  onUpload: (file: File) => Promise<void>;
}

export function ProfilePhotoUploader({ name, profilePhoto, onUpload }: ProfilePhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await onUpload(file);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
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
  );
}
