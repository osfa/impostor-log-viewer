import { useState, useEffect } from 'react';
import type { LogEntry } from '../types';

export const useLogWatcher = (logFilePath: string) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastModified, setLastModified] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`/api/logs?file=${encodeURIComponent(logFilePath)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLogs(data.logs || []);
      setLastModified(data.lastModified || 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    }
  };

  const checkForUpdates = async () => {
    try {
      const response = await fetch(`/api/logs/status?file=${encodeURIComponent(logFilePath)}`);
      if (!response.ok) return;
      
      const data = await response.json();
      if (data.lastModified > lastModified) {
        await fetchLogs();
      }
    } catch (err) {
      console.error('Error checking for updates:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(checkForUpdates, 1000);
    return () => clearInterval(interval);
  }, [logFilePath]);

  return { logs, error, refetch: fetchLogs };
};