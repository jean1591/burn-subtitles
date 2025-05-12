"use client";

import { Button } from "@/components/ui/button";
import { FormattedMessage } from "react-intl";
import { LanguageSelector } from "./LanguageSelector";
import type React from "react";
import { Upload as UploadIcon } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:3000";

export function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const updateFiles = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleLanguageChange = (languages: string[]) => {
    setSelectedLanguages(languages);
  };

  const getValidationError = () => {
    if (!user) {
      if (files.length > 1 || selectedLanguages.length > 1) {
        return "Upgrade to Pro by logging in to upload multiple files or select multiple languages.";
      }
    } else {
      const requiredCredits = files.length * selectedLanguages.length;

      if (requiredCredits > 1 && requiredCredits > user.credits) {
        return "Not enough credits to perform this translation. Please reduce the number of files or target languages.";
      }
    }

    return null;
  };

  const isTranslateDisabled = () => {
    if (files.length === 0 || selectedLanguages.length === 0) return true;

    if (!user) {
      return files.length > 1 || selectedLanguages.length > 1;
    }

    const requiredCredits = files.length * selectedLanguages.length;

    return requiredCredits > 1 && requiredCredits > user.credits;
  };

  const handleTranslate = async () => {
    if (isTranslateDisabled()) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("targetLangs", selectedLanguages.join(","));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        alert(`Upload failed: ${errorText || response.statusText}`);
        return;
      }

      const data = await response.json();

      // Refresh user data to update credits
      if (user) {
        await refreshUser();
      }

      navigate(`/status/${data.batchId}`);
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        `Upload error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
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
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
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
            <h3 className="text-lg font-medium">
              <FormattedMessage
                id="upload.title"
                defaultMessage="Upload subtitle files"
              />
            </h3>
            <p className="text-sm text-neutral-500">
              <FormattedMessage
                id="upload.dragAndDrop"
                defaultMessage="Drag and drop or click to browse"
              />
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <FormattedMessage
                id="upload.selectFiles"
                defaultMessage="Select Files"
              />
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
              <FormattedMessage
                id="upload.supportedFormat"
                defaultMessage="Supported format: .srt"
              />
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-3">
            <h4 className="text-sm font-medium mb-2">
              <FormattedMessage
                id="upload.selectedFiles"
                defaultMessage="Selected Files ({count})"
                values={{ count: files.length }}
              />
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

        <div className="space-y-4">
          <h3 className="text-base font-medium mb-3">
            <FormattedMessage
              id="home.selectLanguages"
              defaultMessage="Select subtitle languages:"
            />
          </h3>
          <LanguageSelector onChange={handleLanguageChange} />

          {getValidationError() && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {getValidationError()}
            </div>
          )}

          <div className="mt-6 text-sm text-neutral-600">
            <p>
              <FormattedMessage
                id="home.freeServiceNote"
                defaultMessage="Free service: Files are processed in order of submission. You'll receive a unique link to track your file's status in the queue."
              />
            </p>
          </div>

          <Button
            className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleTranslate}
            disabled={isTranslateDisabled()}
          >
            <FormattedMessage
              id="home.translateButton"
              defaultMessage="Translate Subtitles"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
