# Impostor Log Viewer

A real-time log viewer for JSON event logs with image support and event type color coding.

## Features

- **Real-time monitoring**: Automatically refreshes log entries every second
- **Event type color coding**: Different colors for `ollama_api_call`, `mood`, and other event types
- **Image display**: Shows images associated with log entries
- **Metadata display**: Shows prompts, responses, mood scores, and other metadata
- **Responsive design**: Built with Tailwind CSS for a modern UI

## Getting Started

1. Navigate to the webapp directory:
   ```bash
   cd webapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start both the API server and Vite dev server:
   ```bash
   npm run start
   ```

4. Open your browser to `http://localhost:5173`

## Usage

- The default log file is set to `../log_samples/d9da5efe-event-log.json`
- You can change the log file path in the input field at the top
- The app will automatically refresh when the log file changes
- Click "Refresh" to manually reload the logs

## Event Types

- **ollama_api_call** (Blue): API calls to the Ollama service
- **mood** (Purple): Mood analysis entries with visual mood scores
- **error** (Red): Error events
- **warning** (Yellow): Warning events
- **default** (Gray): Other event types

## Project Structure

- `src/App.tsx`: Main application component
- `src/components/LogEntry.tsx`: Individual log entry component
- `src/hooks/useLogWatcher.ts`: Hook for monitoring log file changes
- `src/types.ts`: TypeScript type definitions
- `server.js`: Express API server for serving logs and images