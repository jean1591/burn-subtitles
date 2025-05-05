import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Download, FileText } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import React from "react";
import { useQuery } from "@tanstack/react-query";

/* const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}; */

const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:3000";

// Types for job and zip status
interface Job {
  jobId: string;
  fileName: string;
  language: string;
  status: "queued" | "in_progress" | "done" | "error";
}

// Spinner component for loading states
const Spinner: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={`animate-spin h-5 w-5 text-amber-500 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
);

export const StatusPage: React.FC = () => {
  const intl = useIntl();

  const { uuid } = useParams<{ uuid: string }>();
  const { data: restStatus } = useQuery({
    queryKey: ["status", uuid],
    queryFn: async () => {
      if (!uuid) {
        throw new Error("No UUID");
      }

      const res = await fetch(`${apiUrl}/upload/status/${uuid}`);
      if (!res.ok) {
        throw new Error("Job not found");
      }

      return res.json();
    },
    enabled: !!uuid,
    refetchOnWindowFocus: false,
  });

  const [status, setStatus] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [zipReady, setZipReady] = useState(false);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  /* const getOrdinalSuffix = (position: number) => {
    if (intl.locale === "en") {
      if (position === 1) return "st";
      if (position === 2) return "nd";
      if (position === 3) return "rd";
      return "th";
    }
    return "";
  }; */

  useEffect(() => {
    if (uuid) {
      const prev = JSON.parse(localStorage.getItem("burnsub-uuids") || "[]");
      if (!prev.includes(uuid)) {
        localStorage.setItem("burnsub-uuids", JSON.stringify([uuid, ...prev]));
      }
    }
  }, [uuid]);

  useEffect(() => {
    if (restStatus) {
      setStatus(
        restStatus.status === "processing_completed"
          ? "completed"
          : restStatus.status === "processing_failed"
          ? "failed"
          : restStatus.status === "processing_started"
          ? "started"
          : restStatus.status === "queue"
          ? "queue"
          : restStatus.status
      );
      if (restStatus.jobs) setJobs(restStatus.jobs);
      if (restStatus.zipReady) setZipReady(true);
      if (restStatus.zipUrl) {
        // Ensure zipUrl is a proper URL - fix the path
        let formattedUrl = restStatus.zipUrl;

        // If it's an absolute path from the filesystem, convert to a proper API URL
        if (
          formattedUrl.startsWith("/") ||
          formattedUrl.includes(":\\") ||
          formattedUrl.startsWith("\\")
        ) {
          // Extract just the batch ID and filename from the path
          const pathParts = formattedUrl.split("/");
          const batchId = pathParts[pathParts.indexOf("uploads") + 1];

          if (batchId) {
            formattedUrl = `${apiUrl}/uploads/${batchId}/results.zip`;
          } else {
            // Fallback - use the relative URL if we can't extract the batch ID
            formattedUrl = `${apiUrl}${
              formattedUrl.startsWith("/") ? "" : "/"
            }${formattedUrl}`;
          }
        } else if (!formattedUrl.startsWith("http")) {
          // If it's a relative URL, add the API base URL
          formattedUrl = `${apiUrl}${
            formattedUrl.startsWith("/") ? "" : "/"
          }${formattedUrl}`;
        }

        setZipUrl(formattedUrl);
      }
    }
  }, [restStatus, intl]);

  useEffect(() => {
    if (!uuid) return;

    // Connect to /status namespace
    const socket = io(`${apiUrl}/status`, {
      transports: ["websocket", "polling"], // Try WebSocket first, then fallback to polling
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("register", { batchId: uuid });
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.info(`WebSocket disconnected: ${reason}`);
    });

    socket.on(
      "jobDone",
      (payload: {
        batchId: string;
        jobId: string;
        details: { fileName: string; language: string };
      }) => {
        setJobs((prev) =>
          prev.map((job) =>
            job.jobId === payload.jobId ? { ...job, status: "done" } : job
          )
        );
      }
    );
    socket.on("batchComplete", () => {
      setStatus("completed");
    });
    socket.on("zipReady", (payload) => {
      setZipReady(true);
      setZipUrl(payload.zipUrl);
    });
    return () => {
      socket.disconnect();
    };
  }, [uuid, intl]);

  // Keep the direct URL generation function for reliable downloads
  const generateCorrectZipUrl = () => {
    if (!uuid) {
      return null;
    }

    return `${apiUrl}/uploads/${uuid}/results.zip`;
  };

  // Clean up the download handler
  const handleDownloadZip = async () => {
    const directUrl = generateCorrectZipUrl();

    if (!directUrl) {
      alert("Unable to download: missing batch ID");
      return;
    }

    try {
      const response = await fetch(directUrl, {
        method: "GET",
        headers: {
          Accept: "application/zip",
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "results.zip";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading zip:", error);
      alert("Failed to download the file. Please try again.");
    }
  };

  return (
    <main className="flex-1 container px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8 space-y-8">
          {/* Translation Status */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-semibold text-gray-800">
              Translation status
            </h1>

            <div className="px-4 py-1 rounded-full bg-green-50">
              <p className="font-medium text-green-800">Completed</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gray-100 mt-8" />

          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertTitle>
              <p className="text-xl font-semibold text-green-800">
                Your translations are ready!
              </p>
            </AlertTitle>

            <AlertDescription>
              <p className="text-lg text-green-800">
                Download the zip file containing all your translated subtitle
                files.
              </p>
            </AlertDescription>
          </Alert>

          {/* Job Progress List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Translated Files:
            </h3>
            <ul className="space-y-3">
              {jobs.length === 0 ? (
                <li className="text-gray-400 text-sm">
                  <FormattedMessage
                    id="status.noJobs"
                    defaultMessage="No translation jobs yet."
                  />
                </li>
              ) : (
                jobs.map((job) => (
                  <li
                    key={job.fileName}
                    className="flex items-center gap-4 px-4 py-2 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="flex-1 min-w-0 flex items-center justify-start gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <div className="font-medium text-gray-800 truncate">
                        {job.fileName}
                      </div>
                    </div>
                    <div>
                      {job.status === "done" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : job.status === "error" ? (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <Spinner />
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {status === "completed" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {zipReady && zipUrl && (
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-4 py-6 px-8 rounded-lg"
                  onClick={handleDownloadZip}
                >
                  <Download className="size-5" />
                  <p className="text-lg font-medium">
                    Download All Translations
                  </p>
                </Button>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="h-[1px] bg-gray-100 mt-8" />

          <div className="text-sm text-gray-500">
            <p>Translation ID: {uuid}</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            <FormattedMessage
              id="status.backToHome"
              defaultMessage="← Back to Home"
            />
          </Link>
        </div>
      </div>
    </main>
  );
};
