import { Button } from "@/components/ui/button";
import { Features } from "@/components/Features";
import { FormattedMessage } from "react-intl";
import { HowItWorks } from "@/components/HowItWorks";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Upload } from "@/components/Upload";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:3000";

export const HomePage = () => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
  };

  const handleLanguageChange = (languages: string[]) => {
    setSelectedLanguages(languages);
  };

  const handleTranslate = async () => {
    if (files.length === 0 || selectedLanguages.length === 0) {
      // Could add validation feedback here
      return;
    }

    // Call the upload endpoint to get a batch ID
    const formData = new FormData();

    // Add each file to the form data
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Add the selected languages
    formData.append("targetLangs", selectedLanguages.join(","));

    try {
      // Make the API call
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        alert(`Upload failed: ${errorText || response.statusText}`);
        return;
      }

      const data = await response.json();

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

  return (
    <div className="flex min-h-screen flex-col bg-[#FDF8F3]">
      <main className="flex-1">
        <section className="mx-auto container py-12 md:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                <FormattedMessage
                  id="home.automaticTranslation"
                  defaultMessage="Automatic Translation"
                />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-neutral-900">
                <FormattedMessage
                  id="home.title"
                  defaultMessage="Translate Subtitles in Multiple Languages"
                />
              </h1>
              <p className="text-lg text-neutral-600 md:text-xl">
                <FormattedMessage
                  id="home.description"
                  defaultMessage="Upload your subtitle files and get accurate translations in minutes. No manual work needed. No login required."
                />
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
                <p className="text-sm">
                  <FormattedMessage
                    id="home.queueNote"
                    defaultMessage="Note: Your files will be processed in order of submission. You'll be able to track your position in the queue."
                  />
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
              <Upload onUpload={handleFileUpload} />

              <div className="mt-6">
                <h3 className="text-base font-medium mb-3">
                  <FormattedMessage
                    id="home.selectLanguages"
                    defaultMessage="Select subtitle languages:"
                  />
                </h3>
                <LanguageSelector onChange={handleLanguageChange} />
              </div>
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
                disabled={files.length === 0 || selectedLanguages.length === 0}
              >
                <FormattedMessage
                  id="home.translateButton"
                  defaultMessage="Translate Subtitles"
                />
              </Button>
            </div>
          </div>
        </section>

        <Features />
        <HowItWorks />
      </main>
      {/* <Footer /> */}
    </div>
  );
};
