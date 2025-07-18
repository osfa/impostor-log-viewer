import { useState } from 'react';
import { useLogWatcher } from './hooks/useLogWatcher';
import LogEntry from './components/LogEntry';

function App() {
  const [logFile, setLogFile] = useState('../log_samples/d9da5efe-event-log.json');
  const { logs, error, refetch } = useLogWatcher(logFile);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Impostor Log Viewer</h1>
          
          <div className="flex gap-4 items-center mb-4">
            <input
              type="text"
              value={logFile}
              onChange={(e) => setLogFile(e.target.value)}
              placeholder="Path to log file"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={refetch}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Error: {error}
            </div>
          )}

          <div className="text-sm text-gray-600">
            Showing {logs.length} log entries • Auto-refreshing every second
          </div>
        </div>

        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {error ? 'Failed to load logs' : 'No log entries found'}
            </div>
          ) : (
            logs.map((entry, index) => (
              <LogEntry key={`${entry.timestamp}-${index}`} entry={entry} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App
