export interface LogEntry {
  timestamp: number;
  iso_timestamp: string;
  type: string;
  run_id: string;
  prompt?: string;
  full_prompt_length?: number;
  model?: string;
  image_path?: string;
  has_image?: boolean;
  response?: string;
  full_response_length?: number;
  success?: boolean;
  error_message?: string | null;
  timeout?: number;
  api_endpoint?: string;
  caption?: string;
  mood?: number;
  note?: string;
  changes?: string[];
  evaluation?: string;
  // New fields from updated log format
  elapsed_time?: string;
  reflection?: string;
  decision?: string;
  reason?: string;
  novelty?: number;
  boredom?: number;
  drawing_prompt?: string;
  message?: string;
  ready_to_draw?: boolean;
  cooldown_remaining?: number;
  start_time?: number;
  start_time_iso?: string;
  config?: Record<string, unknown>;
}