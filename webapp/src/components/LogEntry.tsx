import React, { useState } from "react";
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
    case "comfy":
    case "comfy_api_call":
    case "comfy_prompt":
      return "bg-red-100 border-red-300 text-red-900";
    case "evaluation":
    case "self_evaluation":
      return "bg-green-50 border-green-200 text-green-800";
    case "internal_note":
      return "bg-orange-50 border-orange-200 text-orange-800";
    case "drawing_prompt":
      return "bg-indigo-50 border-indigo-200 text-indigo-800";
    default:
      return "bg-gray-50 border-gray-200 text-gray-800";
  }
};

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString();
};

const LogEntry: React.FC<LogEntryProps> = ({ entry }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(false);
  const [expandedResponse, setExpandedResponse] = useState(false);
  const [expandedNote, setExpandedNote] = useState(false);
  const [expandedEvaluation, setExpandedEvaluation] = useState(false);
  
  const colorClass = getEventTypeColor(entry.type);

  const renderContent = (text: string, expanded: boolean, setExpanded: (value: boolean) => void, maxRows: number = 3) => {
    const lines = text.split('\n');
    const isVeryLong = lines.length > maxRows || text.length > 500;
    
    if (!isVeryLong) {
      return <div className="text-xs whitespace-pre-wrap">{text}</div>;
    }
    
    const previewText = lines.slice(0, maxRows).join('\n');
    const needsTruncation = previewText.length > 300;
    const displayText = needsTruncation ? previewText.substring(0, 300) + '...' : previewText;
    
    return (
      <div className="text-xs">
        <div className="whitespace-pre-wrap">{expanded ? text : displayText}</div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-blue-600 hover:text-blue-800 underline"
        >
          {expanded ? "show less" : "show more"}
        </button>
      </div>
    );
  };

  return (
    <div className={`border-l-3 p-2 mb-2 rounded-r-md ${colorClass} flex`}>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-white/60">
              {entry.type}
            </span>
            <span className="text-xs text-gray-600">
              {formatTimestamp(entry.timestamp)}
            </span>
          </div>
          <span className="text-xs text-gray-500">{entry.run_id}</span>
        </div>

        {entry.prompt && (
          <div className="mb-1">
            <div className="bg-white/40 p-1.5 rounded">
              <span className="text-xs font-medium text-gray-700">📝 Prompt:</span>
              <div className="mt-1">
                {renderContent(entry.prompt, expandedPrompt, setExpandedPrompt)}
              </div>
            </div>
          </div>
        )}

        {entry.response && (
          <div className="mb-1">
            <div className="bg-white/40 p-1.5 rounded">
              <span className="text-xs font-medium text-gray-700">💬 Response:</span>
              <div className="mt-1">
                {renderContent(entry.response, expandedResponse, setExpandedResponse)}
              </div>
            </div>
          </div>
        )}

        {entry.note && (
          <div className="mb-1">
            <div className="bg-white/40 p-1.5 rounded">
              <span className="text-xs font-medium text-gray-700">📋 Internal Note:</span>
              <div className="mt-1">
                {renderContent(entry.note, expandedNote, setExpandedNote)}
              </div>
              {entry.changes && entry.changes.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs font-medium">Changes:</span>
                  <ul className="text-xs mt-1">
                    {entry.changes.map((change, idx) => (
                      <li key={idx} className="ml-2">• {change}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {entry.evaluation && (
          <div className="mb-1">
            <div className="bg-white/40 p-1.5 rounded">
              <span className="text-xs font-medium text-gray-700">🎯 Self Evaluation:</span>
              <div className="mt-1">
                {renderContent(entry.evaluation, expandedEvaluation, setExpandedEvaluation)}
              </div>
            </div>
          </div>
        )}

        {(entry.mood !== undefined || entry.caption) && (
          <div className="mb-1">
            <div className="bg-white/40 p-1.5 rounded">
              <span className="text-xs font-medium text-gray-700">📊 Metadata:</span>
              <div className="mt-1">
                {entry.mood !== undefined && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">Mood:</span>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${entry.mood * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{entry.mood.toFixed(2)}</span>
                  </div>
                )}
                {entry.caption && (
                  <div className="text-xs mb-1">
                    <span className="font-medium">Caption:</span> {entry.caption}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {entry.error_message && (
          <div className="mb-1">
            <div className="bg-red-50 p-1.5 rounded border border-red-200">
              <span className="text-xs font-medium text-red-600">❌ Error:</span>
              <p className="text-xs text-red-700 mt-1">
                {entry.error_message}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3 text-xs text-gray-500 mt-1">
          {entry.model && <span>🤖 {entry.model}</span>}
          {entry.success !== undefined && (
            <span className={entry.success ? "text-green-600" : "text-red-600"}>
              {entry.success ? "✅" : "❌"}
            </span>
          )}
          {entry.full_response_length && (
            <span>📏 {entry.full_response_length}</span>
          )}
        </div>
      </div>

      {/* Always show images aligned to the right */}
      {entry.image_path && entry.image_path !== null && (
        <div className="ml-4 flex-shrink-0">
          <img
            src={`/api/image?path=${encodeURIComponent(
              entry.image_path.replace("/home/jbe", "/Users/jbe")
            )}`}
            alt="Log entry image"
            className="w-32 h-24 object-cover rounded border"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default LogEntry;
