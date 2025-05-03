"use client";

import { Button } from "@/components/ui/button";
import type React from "react";
import { Upload as UploadIcon } from "lucide-react";
import { useState } from "react";

export function Upload({ onUpload }: { onUpload?: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const updateFiles = (newFiles: File[]) => {
    setFiles(newFiles);
    if (onUpload) {
      onUpload(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.name.endsWith(".srt")
    );

    if (droppedFiles.length > 0) {
      updateFiles([...files, ...droppedFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter((file) =>
        file.name.endsWith(".srt")
      );

      if (selectedFiles.length > 0) {
        updateFiles([...files, ...selectedFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    updateFiles(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-amber-500 bg-amber-50" : "border-neutral-200"
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <UploadIcon className="h-10 w-10 text-amber-500" />
          <h3 className="text-lg font-medium">Upload subtitle files</h3>
          <p className="text-sm text-neutral-500">
            Drag and drop or click to browse
          </p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Select Files
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".srt"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-xs text-neutral-500 mt-2">
            Supported format: .srt
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-3">
          <h4 className="text-sm font-medium mb-2">
            Selected Files ({files.length})
          </h4>
          <ul className="space-y-2 max-h-32 overflow-y-auto">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-sm bg-white p-2 rounded border border-neutral-100"
              >
                <span className="truncate max-w-[200px]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 p-0 text-neutral-500"
                >
                  ×
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
