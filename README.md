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

4. You need to symlink in all-run-log.json from your impostor app repo to impostor-log-viewer. something like:

`ln -s <path to EXTREMELY-EPIC-BUILD/>/mood_snapshots/all-run-log.json ..<path to log viewer>/webapp/log_samples/all-run-log.json`

Logs should automatically update.

5. Open your browser to `http://localhost:5173`

## Usage

- The default log file is set to `../log_samples/all-run-log.json`
- You can change the log file path in the input field at the top
- The app will automatically refresh when the log file changes
- Click "Refresh" to manually reload the logs

## Event Types

- **ollama_api_call** (Blue): API calls to the Ollama service
- **mood** (Purple): Mood analysis entries with visual mood scores
- **error** (Red): Error events
- **warning** (Yellow): Warning events
- **default** (Gray): Other event types

## API Documentation

The application runs two servers:

- **Frontend (Vite)**: `http://localhost:5173`
- **Backend (Express)**: `http://localhost:3001`

### API Endpoints

#### GET `/api/logs`

Retrieves log entries from a specified JSON file.

**Query Parameters:**

- `file` (required): Path to the log file (e.g., `../log_samples/all-run-log.json`)

**Response:**

```json
{
  "logs": [
    {
      "timestamp": 1752836907,
      "iso_timestamp": "2025-07-18T13:08:27",
      "type": "ollama_api_call",
      "run_id": "d9da5efe",
      "prompt": "Describe the scene",
      "model": "llava",
      "image_path": "/path/to/image.jpg",
      "has_image": true,
      "response": "The image shows...",
      "success": true
    }
  ],
  "lastModified": 1752836907000
}
```

#### GET `/api/logs/status`

Checks the last modified time of a log file for real-time monitoring.

**Query Parameters:**

- `file` (required): Path to the log file

**Response:**

```json
{
  "lastModified": 1752836907000
}
```

#### GET `/api/image`

Serves image files associated with log entries.

**Query Parameters:**

- `path` (required): Path to the image file

**Response:** Returns the image file or 404 if not found.

### Security Features

- **Path validation**: Only allows access to files within the `log_samples` directory
- **CORS enabled**: Allows cross-origin requests from the frontend
- **Error handling**: Proper error responses for invalid requests

### Real-time Monitoring

The frontend polls the `/api/logs/status` endpoint every second to check for file changes. When a change is detected, it fetches the updated logs via `/api/logs`.

## Project Structure

- `src/App.tsx`: Main application component
- `src/components/LogEntry.tsx`: Individual log entry component
- `src/hooks/useLogWatcher.ts`: Hook for monitoring log file changes
- `src/types.ts`: TypeScript type definitions
- `server.js`: Express API server for serving logs and images
