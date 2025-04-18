import { Socket, io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

import React from "react";
import { useParams } from "react-router-dom";

interface ServerEvent {
  type: string;
  payload: unknown;
}

export const StatusPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [log, setLog] = useState<ServerEvent[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!uuid) return;
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.on("connect", () => {
      setLog((prev) => [
        { type: "connect", payload: "Connected to server" },
        ...prev,
      ]);
      socket.emit("register", { uuid });
    });

    const eventTypes = [
      "register_ack",
      "video_added_to_queue",
      "queue_position_update",
      "processing_started",
      "processing_completed",
      "processing_failed",
    ];
    eventTypes.forEach((event) => {
      socket.on(event, (payload: unknown) => {
        setLog((prev) => [{ type: event, payload }, ...prev]);
      });
    });

    socket.onAny((event: string, payload: unknown) => {
      if (!eventTypes.includes(event) && event !== "connect") {
        setLog((prev) => [{ type: event, payload }, ...prev]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [uuid]);

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Video Status Page
      </h1>
      <div className="bg-white border rounded-lg p-4">
        <p className="text-gray-700">Tracking status for UUID:</p>
        <p className="font-mono text-amber-700 text-lg mt-2">{uuid}</p>
        <div className="mt-4">
          <h2 className="font-semibold mb-2 text-gray-700">Event Log</h2>
          <ul className="space-y-1 text-sm max-h-64 overflow-y-auto">
            {log.length === 0 && (
              <li className="text-gray-400">No events yet.</li>
            )}
            {log.map((entry, idx) => (
              <li key={idx}>
                <span className="font-mono text-amber-700">[{entry.type}]</span>{" "}
                <span className="break-all">
                  {JSON.stringify(entry.payload)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
