import React from "react";
import { useParams } from "react-router-dom";

export const StatusPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Video Status Page
      </h1>
      <div className="bg-white border rounded-lg p-4">
        <p className="text-gray-700">Tracking status for UUID:</p>
        <p className="font-mono text-amber-700 text-lg mt-2">{uuid}</p>
        <p className="mt-4 text-gray-500">(Status details coming soon...)</p>
      </div>
    </div>
  );
};
