import { AlertCircle, CheckCircle, Download, FileText } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  JobStatus,
  ProcessStatus,
  UIStatus,
} from "../constants/process-status";
import { Link, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { DetailsPanel } from "./status/DetailsPanel";
import { EventTypes } from "../constants/events";
import React from "react";
import { StatusPill } from "./status/StatusPill";
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
export interface Job {
  jobId: string;
  fileName: string;
  language: string;
  status: JobStatus;
}

// Spinner component for loading states
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      strokeWidth="3"
      stroke="#E5E7EB"
      fill="none"
    ></circle>
    <path
      strokeWidth="3"
      stroke="#F59E0B"
      strokeLinecap="round"
      d="M12 2C6.48 2 2 6.48 2 12"
      fill="none"
    ></path>
  </svg>
);

const getStatus = (restStatus: {
  status: string;
  zipReady: boolean;
}): UIStatus | string => {
  return restStatus.status === ProcessStatus.PROCESSING_COMPLETED &&
    !restStatus.zipReady
    ? UIStatus.ZIPPING
    : restStatus.status === ProcessStatus.PROCESSING_COMPLETED
    ? UIStatus.COMPLETED
    : restStatus.status === ProcessStatus.PROCESSING_FAILED
    ? UIStatus.FAILED
    : restStatus.status === ProcessStatus.PROCESSING_STARTED
    ? UIStatus.STARTED
    : restStatus.status === ProcessStatus.QUEUE
    ? UIStatus.QUEUE
    : restStatus.status;
};

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
      setStatus(getStatus(restStatus));

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

    socket.on(EventTypes.CONNECT, () => {
      socket.emit(EventTypes.REGISTER, { batchId: uuid });
    });

    socket.on(EventTypes.CONNECT_ERROR, (err: Error) => {
      console.error("WebSocket connection error:", err);
    });

    socket.on(EventTypes.DISCONNECT, (reason: string) => {
      console.info(`WebSocket disconnected: ${reason}`);
    });

    socket.on(
      EventTypes.JOB_DONE,
      (payload: {
        batchId: string;
        jobId: string;
        details: { fileName: string; language: string };
      }) => {
        setJobs((prev) =>
          prev.map((job) =>
            job.jobId === payload.jobId
              ? { ...job, status: JobStatus.DONE }
              : job
          )
        );
      }
    );
    socket.on(EventTypes.BATCH_COMPLETE, () => {
      setStatus(UIStatus.COMPLETED);
    });
    socket.on(
      EventTypes.ZIP_READY,
      (payload: { batchId: string; zipUrl: string }) => {
        setZipReady(true);
        setZipUrl(payload.zipUrl);
      }
    );
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

            <StatusPill status={status} />
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gray-100 mt-8" />

          <DetailsPanel status={status} jobs={jobs} />

          {/* Job Progress List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Translated Files:
            </h3>
            <ul className="space-y-3">
              {jobs.length === 0 ? (
                <li className="text-gray-400 text-sm">
                  No translation jobs yet.
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

          {status === "completed" && zipReady && zipUrl && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-4 py-6 px-8 rounded-lg"
                onClick={handleDownloadZip}
              >
                <Download className="size-5" />
                <p className="text-lg font-medium">Download All Translations</p>
              </Button>
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
