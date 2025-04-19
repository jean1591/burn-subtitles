"use client";

import { FileVideo, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormattedMessage } from "react-intl";
import { Label } from "@/components/ui/label";
import type React from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const LANGUAGES = [
  { id: "english", labelId: "languages.english" },
  { id: "french", labelId: "languages.french" },
  { id: "spanish", labelId: "languages.spanish" },
  { id: "german", labelId: "languages.german" },
  { id: "italian", labelId: "languages.italian" },
];

export function Upload() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "english",
  ]);
  const [uploading, setUploading] = useState(false);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("video/")) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file && selectedLanguages.length > 0) {
      setUploading(true);
      // Generate UUID
      const newUuid = uuidv4();
      const formData = new FormData();
      formData.append("video", file);
      formData.append("languages", JSON.stringify(selectedLanguages));
      formData.append("uuid", newUuid); // Pass UUID to backend
      try {
        const response = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        const data = await response.json();
        if (data.uuid) {
          navigate(`/status/${data.uuid}`);
        } else {
          alert("Unexpected response from server.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to upload video. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-amber-500 bg-amber-50"
            : "border-amber-200 hover:border-amber-300",
          file ? "bg-amber-50" : "bg-white"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <input
          id="file-upload"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileVideo className="h-10 w-10 text-amber-500" />
            <p className="font-medium text-gray-800">{file.name}</p>
            <p className="text-sm text-gray-500">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadIcon className="h-10 w-10 text-amber-400" />
            <p className="font-medium text-gray-800">
              <FormattedMessage
                id="upload.title"
                defaultMessage="Upload your video"
              />
            </p>
            <p className="text-sm text-gray-500">
              <FormattedMessage
                id="upload.dragDrop"
                defaultMessage="Drag and drop or click to browse"
              />
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-800">
          <FormattedMessage
            id="upload.selectLanguages"
            defaultMessage="Select subtitle languages:"
          />
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((language) => (
            <div key={language.id} className="flex items-center space-x-2">
              <Checkbox
                id={language.id}
                checked={selectedLanguages.includes(language.id)}
                onCheckedChange={() => handleLanguageChange(language.id)}
              />
              <Label htmlFor={language.id} className="text-gray-700">
                <FormattedMessage
                  id={language.labelId}
                  defaultMessage={language.id}
                />
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
        <p className="text-sm text-amber-800">
          <FormattedMessage
            id="upload.queueNotice"
            defaultMessage="Free service: Videos are processed in order of submission. You'll receive a unique link to track your video's status in the queue."
          />
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        disabled={!file || selectedLanguages.length === 0 || uploading}
      >
        <FormattedMessage
          id="upload.button"
          defaultMessage="Generate Subtitles"
        />
      </Button>
    </form>
  );
}
