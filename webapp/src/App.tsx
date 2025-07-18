import { useState, useMemo } from "react";
import { useLogWatcher } from "./hooks/useLogWatcher";
import LogEntry from "./components/LogEntry";

function App() {
  const [logFile, setLogFile] = useState("../log_samples//all-run-log.json");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { logs, error, refetch } = useLogWatcher(logFile);

  // Get unique event types from logs
  const availableTypes = useMemo(() => {
    const types = new Set(logs.map(log => log.type));
    return Array.from(types).sort();
  }, [logs]);

  // Filter logs based on selected types
  const filteredLogs = useMemo(() => {
    if (selectedTypes.length === 0) return logs;
    return logs.filter(log => selectedTypes.includes(log.type));
  }, [logs, selectedTypes]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => setSelectedTypes([]);
  const selectAllTypes = () => setSelectedTypes([...availableTypes]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Impostor Log Viewer
          </h1>

          <div className="flex gap-3 items-center mb-3">
            <input
              type="text"
              value={logFile}
              onChange={(e) => setLogFile(e.target.value)}
              placeholder="Path to log file"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={refetch}
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Refresh
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 text-sm">
              Error: {error}
            </div>
          )}

          {/* Filter Controls */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Filter by type:</span>
              <button
                onClick={selectAllTypes}
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                All
              </button>
              <button
                onClick={clearFilters}
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    selectedTypes.includes(type)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {type} ({logs.filter(log => log.type === type).length})
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {logs.length} log entries • Auto-refreshing every second
            {selectedTypes.length > 0 && (
              <span className="ml-2 text-blue-600">
                • Filtered by: {selectedTypes.join(', ')}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {error ? "Failed to load logs" : selectedTypes.length > 0 ? "No logs match the selected filters" : "No log entries found"}
            </div>
          ) : (
            filteredLogs.map((entry, index) => (
              <LogEntry key={`${entry.timestamp}-${index}`} entry={entry} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
