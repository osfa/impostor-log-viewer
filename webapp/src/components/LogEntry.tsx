import React from "react";
import type { LogEntry as LogEntryType } from "../types";

interface LogEntryProps {
  entry: LogEntryType;
}

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "ollama_api_call":
      return "bg-blue-50 border-blue-200 text-blue-800";
    case "mood":
      return "bg-purple-50 border-purple-200 text-purple-800";
    case "error":
      return "bg-red-50 border-red-200 text-red-800";
    case "warning":
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    default:
      return "bg-gray-50 border-gray-200 text-gray-800";
  }
};

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString();
};

const LogEntry: React.FC<LogEntryProps> = ({ entry }) => {
  const colorClass = getEventTypeColor(entry.type);

  return (
    <div className={`border-l-4 p-4 mb-4 rounded-r-lg ${colorClass}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/50">
            {entry.type}
          </span>
          <span className="text-xs text-gray-600">
            {formatTimestamp(entry.timestamp)}
          </span>
        </div>
        <span className="text-xs text-gray-500">{entry.run_id}</span>
      </div>

      {entry.prompt && (
        <div className="mb-2">
          <h4 className="font-medium text-sm mb-1">Prompt:</h4>
          <p className="text-sm bg-white/30 p-2 rounded text-gray-700">
            {entry.prompt.length > 200
              ? `${entry.prompt.substring(0, 200)}...`
              : entry.prompt}
          </p>
        </div>
      )}

      {entry.response && (
        <div className="mb-2">
          <h4 className="font-medium text-sm mb-1">Response:</h4>
          <p className="text-sm bg-white/30 p-2 rounded text-gray-700">
            {entry.response.length > 300
              ? `${entry.response.substring(0, 300)}...`
              : entry.response}
          </p>
        </div>
      )}

      {entry.mood !== undefined && (
        <div className="mb-2">
          <h4 className="font-medium text-sm mb-1">Mood Score:</h4>
          <div className="flex items-center gap-2">
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${entry.mood * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium">{entry.mood.toFixed(2)}</span>
          </div>
        </div>
      )}

      {entry.image_path && entry.image_path !== null && (
        <div className="mb-2">
          <h4 className="font-medium text-sm mb-1">Image:</h4>
          <img
            src={`/api/image?path=${encodeURIComponent(
              entry.image_path.replace("/home/jbe", "/Users/jbe")
            )}`}
            alt="Log entry image"
            className="max-w-xs max-h-48 rounded border"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      {entry.error_message && (
        <div className="mb-2">
          <h4 className="font-medium text-sm mb-1 text-red-600">Error:</h4>
          <p className="text-sm bg-red-50 p-2 rounded text-red-700">
            {entry.error_message}
          </p>
        </div>
      )}

      <div className="flex gap-4 text-xs text-gray-500 mt-2">
        {entry.model && <span>Model: {entry.model}</span>}
        {entry.success !== undefined && (
          <span className={entry.success ? "text-green-600" : "text-red-600"}>
            {entry.success ? "Success" : "Failed"}
          </span>
        )}
        {entry.full_response_length && (
          <span>Response Length: {entry.full_response_length}</span>
        )}
      </div>
    </div>
  );
};

export default LogEntry;
