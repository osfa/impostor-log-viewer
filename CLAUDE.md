# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start Development Environment:**
```bash
cd webapp
npm install
npm run start  # Runs both API server (port 3001) and Vite dev server (port 5173) concurrently
```

**Individual Server Commands:**
```bash
npm run api    # Express API server only
npm run dev    # Vite dev server only
npm run build  # TypeScript compilation + Vite build
npm run lint   # ESLint code quality check
```

**Log File Setup (Required):**
Create symlink from external impostor application to log viewer:
```bash
ln -s <path-to-EXTREMELY-EPIC-BUILD>/mood_snapshots/all-run-log.json webapp/log_samples/all-run-log.json
```

## Architecture Overview

**Dual-Server Architecture:**
- **Frontend**: React 19 + TypeScript + Tailwind CSS on Vite dev server (5173)
- **Backend**: Express.js API server (3001) with Vite proxy configuration
- **Real-time Updates**: 1-second polling of file modification timestamps

**Core Data Flow:**
JSON log files → Express API (path validation + JSON parsing) → React frontend (real-time monitoring + filtering)

## Key Components

**Backend (`server.js`):**
- `/api/logs` - Parses JSON log files with Windows/Unix path normalization
- `/api/logs/status` - File change detection for real-time updates  
- `/api/image` - Secure image serving with cross-platform path validation
- **Security**: Path validation restricts access to `log_samples`, `impostor_event_log`, `mood_snapshots` directories
- **Symlink Support**: Resolves real paths for Windows symlink compatibility

**Frontend Core:**
- `useLogWatcher.ts` - Custom hook for automatic polling and state management
- `LogEntry.tsx` - Event type color coding (8+ types) with expandable content
- `App.tsx` - File path management, filtering system, error handling

## Data Structure

**Log Entry Schema:**
```typescript
{
  timestamp: number,
  type: string,        # Event type for color coding
  run_id: string,
  prompt?: string,     # Expandable content
  response?: string,   # Expandable content  
  image_path?: string, # Served via /api/image
  mood?: number,       # 0-1 scale with progress bar
  model?: string,
  // 15+ optional fields...
}
```

**Event Types with Color Coding:**
- `ollama_api_call` (Blue), `mood` (Purple), `error` (Red), `warning` (Yellow)
- `comfy_api_call` (Red variants), `evaluation` (Green), `internal_note` (Orange)
- `drawing_prompt` (Indigo), default (Gray)

## Path Handling (Critical)

**Cross-Platform Compatibility:**
- Server normalizes Windows backslashes to forward slashes
- Path validation works with both Unix/Windows symlinks
- Image paths from JSON are normalized in `normalizePaths()` function

**Security Constraints:**
- Log files: Must resolve within `../log_samples` directory
- Images: Allowed from `impostor_event_log`, `log_samples`, `mood_snapshots`, `love_yourself_refactor` paths

## Common Development Issues

**JSON Parsing Failures:**
- Use debug logging in server.js to inspect file contents
- Check for Windows path escaping issues in JSON strings
- Verify symlink targets exist and are accessible

**403 Image Errors:**
- Ensure image paths contain allowed directory names
- Check server console for path validation debug output
- Verify symlink resolution on Windows systems

**Real-time Updates:**
- File polling occurs every 1 second via `useLogWatcher`
- Changes detected by comparing `lastModified` timestamps
- Manual refresh available via "Refresh" button

## Integration Context

This application monitors logs from an external "impostor" AI application that generates:
- Multi-modal AI interactions (text + images)
- Mood analysis with numerical scores
- ComfyUI and Ollama API calls
- Self-evaluation and internal notes

The log viewer serves as a real-time development dashboard for AI/ML workflow monitoring.