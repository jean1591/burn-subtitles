import React, { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

import { Button } from "@/components/ui/button";

interface ServerEvent {
  type: string;
  payload: unknown;
}

const apiUrl = process.env.VITE_APP_API_URL || "http://localhost:3000";

export const WsTestPage: React.FC = () => {
  const [uuid, setUuid] = useState("");
  const [log, setLog] = useState<ServerEvent[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(apiUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server");
      setLog((prev) => [
        { type: "connect", payload: "Connected to server" },
        ...prev,
      ]);
    });

    const eventTypes = [
      "register_ack",
      "video_added_to_queue",
      "queue_position_update",
      // Add more event types as needed
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
  }, []);

  const handleRegister = () => {
    if (socketRef.current && uuid) {
      socketRef.current.emit("register", { uuid });
      setLog((prev) => [{ type: "register", payload: { uuid } }, ...prev]);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        WebSocket Test Page
      </h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border rounded px-3 py-2 flex-1"
          placeholder="Enter UUID"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
        />
        <Button onClick={handleRegister} type="button">
          Register UUID
        </Button>
      </div>
      <div className="bg-white border rounded-lg p-4 h-80 overflow-y-auto">
        <h2 className="font-semibold mb-2 text-gray-700">Event Log</h2>
        <ul className="space-y-1 text-sm">
          {log.length === 0 && (
            <li className="text-gray-400">No events yet.</li>
          )}
          {log.map((entry, idx) => (
            <li key={idx}>
              <span className="font-mono text-amber-700">[{entry.type}]</span>{" "}
              <span className="break-all">{JSON.stringify(entry.payload)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
