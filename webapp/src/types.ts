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
}