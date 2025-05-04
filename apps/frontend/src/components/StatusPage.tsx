import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock, Download } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import React from "react";
import { useQuery } from "@tanstack/react-query";

type BackendEvent = {
  type: string;
  timestamp: number;
  payload?: Record<string, unknown>;
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

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
  const {
    data: restStatus,
    isLoading: isRestLoading,
    isError: isRestError,
    error: restError,
  } = useQuery({
    queryKey: ["status", uuid],
    queryFn: async () => {
      if (!uuid) throw new Error("No UUID");
      const res = await fetch(`${apiUrl}/upload/status/${uuid}`);
      if (!res.ok) throw new Error("Job not found");
      return res.json();
    },
    enabled: !!uuid,
    refetchOnWindowFocus: false,
  });

  const [status, setStatus] = useState<string | null>(null);
  const [queuePosition] = useState<number>(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [zipReady, setZipReady] = useState(false);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timeRemaining = 3600; // 1 hour in seconds
  const socketRef = useRef<Socket | null>(null);
  const [statusEvents, setStatusEvents] = useState<
    {
      timestamp: number;
      message: string;
    }[]
  >([]);

  const getOrdinalSuffix = (position: number) => {
    if (intl.locale === "en") {
      if (position === 1) return "st";
      if (position === 2) return "nd";
      if (position === 3) return "rd";
      return "th";
    }
    return "";
  };

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
      if (restStatus.zipUrl)
        setZipUrl(
          restStatus.zipUrl.startsWith("http")
            ? restStatus.zipUrl
            : `${apiUrl}/${restStatus.zipUrl}`
        );
      if (restStatus.failedReason) setError(restStatus.failedReason);
      if (Array.isArray(restStatus.events)) {
        setStatusEvents(
          (restStatus.events as BackendEvent[]).map((event) => {
            let message = "";
            switch (event.type) {
              case "jobDone":
                message = intl.formatMessage({
                  id: "status.jobDoneEvent",
                  defaultMessage: "A translation finished.",
                });
                break;
              case "batchComplete":
                message = intl.formatMessage({
                  id: "status.batchCompleteEvent",
                  defaultMessage: "All translations completed.",
                });
                break;
              case "zipReady":
                message = intl.formatMessage({
                  id: "status.zipReadyEvent",
                  defaultMessage: "Download is ready.",
                });
                break;
              default:
                message = event.type;
            }
            return {
              timestamp: event.timestamp,
              message,
            };
          })
        );
      }
    }
  }, [restStatus, intl]);

  useEffect(() => {
    if (!uuid) return;
    // Connect to /status namespace
    const socket = io(`${apiUrl}/status`);
    socketRef.current = socket;
    socket.emit("register", { batchId: uuid });

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
        setStatusEvents((prev) => [
          ...prev,
          {
            timestamp: Date.now(),
            message: intl.formatMessage({
              id: "status.jobDoneEvent",
              defaultMessage: `Translation done: ${payload.details.fileName} (${payload.details.language})`,
            }),
          },
        ]);
      }
    );
    socket.on("batchComplete", () => {
      setStatus("completed");
      setStatusEvents((prev) => [
        ...prev,
        {
          timestamp: Date.now(),
          message: intl.formatMessage({
            id: "status.batchCompleteEvent",
            defaultMessage: "All translations completed.",
          }),
        },
      ]);
    });
    socket.on("zipReady", (payload) => {
      setZipReady(true);
      setZipUrl(payload.zipUrl);
      setStatusEvents((prev) => [
        ...prev,
        {
          timestamp: Date.now(),
          message: intl.formatMessage({
            id: "status.zipReadyEvent",
            defaultMessage: "Download is ready.",
          }),
        },
      ]);
    });
    return () => {
      socket.disconnect();
    };
  }, [uuid, intl]);

  if (isRestLoading) {
    // Show skeleton cards for jobs loading
    return (
      <main className="flex-1 container px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            <FormattedMessage id="status.title" defaultMessage="Video Status" />
          </h1>
          <div className="bg-white p-6 rounded-xl border border-amber-100 mb-8">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-lg bg-amber-50 border border-amber-100 animate-pulse"
                >
                  <div className="h-6 w-6 rounded-full bg-amber-200" />
                  <div className="flex-1">
                    <div className="h-4 w-1/3 bg-amber-100 rounded mb-2" />
                    <div className="h-3 w-1/4 bg-amber-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }
  if (isRestError) {
    return (
      <main className="flex-1 container px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto text-center py-12 text-lg text-red-600">
          {restError instanceof Error
            ? restError.message
            : "Error loading status."}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 container px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          <FormattedMessage id="status.title" defaultMessage="Video Status" />
        </h1>

        <div className="bg-white p-6 rounded-xl border border-amber-100 mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              <FormattedMessage
                id="status.eventLog"
                defaultMessage="Status Updates"
              />
            </h3>
            <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
              {statusEvents.length === 0 ? (
                <li className="text-gray-400">
                  <FormattedMessage
                    id="status.noEvents"
                    defaultMessage="No status updates yet."
                  />
                </li>
              ) : (
                statusEvents.map((event, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <span className="font-mono text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    <span>{event.message}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              <FormattedMessage id="status.jobId" defaultMessage="Job ID" />:{" "}
              {uuid ? `${uuid.slice(0, 8)}...` : "..."}
            </h2>
            {status === "queue" && (
              <div className="mb-6">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <h3 className="font-medium text-amber-800">
                      <FormattedMessage
                        id="status.queuePosition"
                        defaultMessage="Queue Position"
                      />
                      : {queuePosition}
                    </h3>
                  </div>
                  <p className="text-amber-700">
                    <FormattedMessage
                      id="status.inLine"
                      defaultMessage="Your files are currently {position}{suffix} in line. Estimated wait time: {minutes} minutes."
                      values={{
                        position: queuePosition,
                        suffix: getOrdinalSuffix(queuePosition),
                        minutes: queuePosition * 5,
                      }}
                    />
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-amber-600 h-2.5 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Job Progress List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <FormattedMessage
                id="status.translationProgress"
                defaultMessage="Translation Progress"
              />
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
                    key={job.jobId + job.language}
                    className="flex items-center gap-4 p-4 rounded-lg bg-amber-50 border border-amber-100"
                  >
                    <div>
                      {job.status === "done" ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : job.status === "error" ? (
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      ) : (
                        <Spinner />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">
                        {job.fileName}
                      </div>
                      <div className="text-sm text-amber-700 font-mono">
                        {job.language.toUpperCase()}
                      </div>
                    </div>
                    <div>
                      {job.status === "done" && (
                        <span className="text-green-700 text-xs font-semibold uppercase">
                          Done
                        </span>
                      )}
                      {job.status === "in_progress" && (
                        <span className="text-amber-700 text-xs font-semibold uppercase">
                          Translating…
                        </span>
                      )}
                      {job.status === "queued" && (
                        <span className="text-amber-500 text-xs font-semibold uppercase">
                          Queued
                        </span>
                      )}
                      {job.status === "error" && (
                        <span className="text-red-700 text-xs font-semibold uppercase">
                          Error
                        </span>
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <Alert
            className={`mb-6 ${
              status === "completed"
                ? "bg-green-100 text-green-800 border-green-200"
                : status === "failed"
                ? "bg-red-100 text-red-800 border-red-200"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              {status === "completed" ? (
                <CheckCircle className="h-5 w-5 text-green-800" />
              ) : status === "failed" ? (
                <AlertCircle className="h-5 w-5 text-red-800" />
              ) : (
                <Clock className="h-5 w-5 text-amber-600" />
              )}
              <AlertTitle>
                <FormattedMessage
                  id="status.statusLabel"
                  defaultMessage="Status"
                />
                :
                <FormattedMessage
                  id={`status.${status || ""}`}
                  defaultMessage={
                    (status || "").charAt(0).toUpperCase() +
                    (status || "").slice(1)
                  }
                />
              </AlertTitle>
            </div>
            <AlertDescription>
              {status === "queue" && (
                <FormattedMessage
                  id="status.queueMessage"
                  defaultMessage="Your files are waiting in the queue. We'll process them as soon as possible."
                />
              )}
              {status === "started" && (
                <FormattedMessage
                  id="status.startedMessage"
                  defaultMessage="Processing has started. This may take a few minutes."
                />
              )}
              {status === "completed" && (
                <FormattedMessage
                  id="status.completedMessage"
                  defaultMessage="All translations are completed! Download the ZIP now."
                />
              )}
              {status === "failed" &&
                (error || (
                  <FormattedMessage
                    id="status.failedMessage"
                    defaultMessage="We encountered an error while processing your files. Please try again."
                  />
                ))}
            </AlertDescription>
          </Alert>

          {status === "completed" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {zipReady && zipUrl && (
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2 px-4 py-2 rounded"
                    asChild
                  >
                    <a href={zipUrl} download>
                      <Download className="h-4 w-4" />
                      <FormattedMessage
                        id="status.downloadAll"
                        defaultMessage="Download All Translations"
                      />
                    </a>
                  </Button>
                )}
                <p className="text-sm text-gray-600">
                  <FormattedMessage
                    id="status.deleteNotice"
                    defaultMessage="Your files will be deleted in"
                  />{" "}
                  {formatTime(timeRemaining)}
                </p>
              </div>

              <div className="border-t border-amber-100 pt-4">
                <h3 className="font-medium text-gray-800 mb-2">
                  <FormattedMessage
                    id="status.languagesIncluded"
                    defaultMessage="Languages included:"
                  />
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 text-sm">
                    <FormattedMessage
                      id="languages.english"
                      defaultMessage="English"
                    />
                  </span>
                  <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 text-sm">
                    <FormattedMessage
                      id="languages.french"
                      defaultMessage="French"
                    />
                  </span>
                  <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 text-sm">
                    <FormattedMessage
                      id="languages.spanish"
                      defaultMessage="Spanish"
                    />
                  </span>
                </div>
              </div>
            </div>
          )}

          {status === "failed" && (
            <div className="space-y-4">
              <Alert className="bg-red-100 text-red-800 border-red-200">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>
                  <FormattedMessage
                    id="status.failed"
                    defaultMessage="Processing Failed"
                  />
                </AlertTitle>
                <AlertDescription>
                  <FormattedMessage
                    id="status.failedMessage"
                    defaultMessage="We encountered an error while processing your files. Please try again."
                  />
                </AlertDescription>
              </Alert>

              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <FormattedMessage
                  id="status.tryAgain"
                  defaultMessage="Try Again"
                />
              </Button>
            </div>
          )}
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
