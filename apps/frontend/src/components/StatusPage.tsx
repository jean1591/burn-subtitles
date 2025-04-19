import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock, Download } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import React from "react";
import { useQuery } from "@tanstack/react-query";

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

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
      const res = await fetch(`http://localhost:3000/status/${uuid}`);
      if (!res.ok) throw new Error("Job not found");
      return res.json();
    },
    enabled: !!uuid,
    refetchOnWindowFocus: false,
  });

  const [status, setStatus] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number>(1);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timeRemaining = 3600; // 1 hour in seconds
  const socketRef = useRef<Socket | null>(null);

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
      if (restStatus.videoUrl) {
        setVideoUrl(
          restStatus.videoUrl.startsWith("http")
            ? restStatus.videoUrl
            : `http://localhost:3000${restStatus.videoUrl}`
        );
      }
      if (restStatus.failedReason) setError(restStatus.failedReason);
    }
  }, [restStatus]);

  useEffect(() => {
    if (!uuid) return;
    const socket = io("http://localhost:3000");
    socketRef.current = socket;
    socket.emit("register", { uuid });
    socket.on("video_added_to_queue", () => setStatus("queue"));
    socket.on("queue_position_update", (payload: { position: number }) => {
      setQueuePosition(payload.position ?? 1);
      setStatus("queue");
    });
    socket.on("processing_started", () => setStatus("started"));
    socket.on("processing_completed", (payload: { videoUrl: string }) => {
      setStatus("completed");
      setVideoUrl(
        payload.videoUrl.startsWith("http")
          ? payload.videoUrl
          : `http://localhost:3000${payload.videoUrl}`
      );
    });
    socket.on("processing_failed", (payload: { error: string }) => {
      setStatus("failed");
      setError(payload.error || "Unknown error");
    });
    return () => {
      socket.disconnect();
    };
  }, [uuid]);

  if (isRestLoading) {
    return (
      <main className="flex-1 container px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto text-center py-12 text-lg text-gray-600">
          Loading status...
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
                      defaultMessage="Your video is currently {position}{suffix} in line. Estimated wait time: {minutes} minutes."
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
                  defaultMessage="Your video is waiting in the queue. We'll process it as soon as possible."
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
                  defaultMessage="Your video is ready! Download it now."
                />
              )}
              {status === "failed" &&
                (error || (
                  <FormattedMessage
                    id="status.failedMessage"
                    defaultMessage="We encountered an error while processing your video. Please try again."
                  />
                ))}
            </AlertDescription>
          </Alert>

          {status === "completed" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {videoUrl ? (
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2 px-4 py-2 rounded"
                    onClick={async (e) => {
                      e.preventDefault();
                      const confirmed = window.confirm(
                        intl.formatMessage({
                          id: "status.downloadConfirm",
                          defaultMessage:
                            "Do you want to save the processed video to your computer?",
                        })
                      );
                      if (!confirmed) return;
                      // Try to fetch the file to check if it exists
                      try {
                        const response = await fetch(videoUrl, {
                          method: "HEAD",
                        });
                        if (!response.ok) {
                          window.alert(
                            intl.formatMessage({
                              id: "status.downloadNotFound",
                              defaultMessage:
                                "The processed video file was not found. Please try again later or refresh the page.",
                            })
                          );
                          return;
                        }
                        // Create a temporary link to trigger download
                        const a = document.createElement("a");
                        a.href = videoUrl;
                        a.download = `${uuid}_with_subs.mp4`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      } catch {
                        window.alert(
                          intl.formatMessage({
                            id: "status.downloadError",
                            defaultMessage:
                              "An error occurred while trying to download the video.",
                          })
                        );
                      }
                    }}
                  >
                    <Download className="h-4 w-4" />
                    <FormattedMessage
                      id="status.download"
                      defaultMessage="Download Video"
                    />
                  </Button>
                ) : (
                  <span className="text-red-600">
                    <FormattedMessage
                      id="status.downloadNotReady"
                      defaultMessage="The processed video is not available yet. Please wait or refresh."
                    />
                  </span>
                )}
                <p className="text-sm text-gray-600">
                  <FormattedMessage
                    id="status.deleteNotice"
                    defaultMessage="Your file will be deleted in"
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
                    defaultMessage="We encountered an error while processing your video. Please try again."
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
