import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Helper function to normalize paths in JSON data for cross-platform compatibility
const normalizePaths = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(normalizePaths);
  } else if (obj && typeof obj === 'object') {
    const normalized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && key.includes('path')) {
        // Normalize path-like strings to use forward slashes
        normalized[key] = value.replace(/\\/g, '/');
      } else {
        normalized[key] = normalizePaths(value);
      }
    }
    return normalized;
  }
  return obj;
};

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API endpoint to get logs
app.get('/api/logs', (req, res) => {
  const { file } = req.query;
  
  if (!file) {
    return res.status(400).json({ error: 'File parameter is required' });
  }
  
  try {
    const logPath = path.resolve(__dirname, file);
    console.log('Requested file:', file);
    console.log('Resolved logPath:', logPath);
    
    // Security check - ensure file is within allowed directory
    const normalizedLogPath = path.normalize(logPath);
    const baseDir = path.resolve(__dirname, '../log_samples');
    const normalizedBaseDir = path.normalize(baseDir);
    
    if (!normalizedLogPath.startsWith(normalizedBaseDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Check if file exists
    if (!fs.existsSync(logPath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const stats = fs.statSync(logPath);
    const data = fs.readFileSync(logPath, 'utf8');
    console.log('File data length:', data.length);
    console.log('File data preview:', data.substring(0, 100));
    
    // Clean up potential Windows path issues in JSON
    const cleanedData = data
      .replace(/\\\\/g, '/') // Convert double backslashes to forward slashes
      .replace(/\\(?!["\\/bfnrt])/g, '/'); // Convert single backslashes to forward slashes (except JSON escape sequences)
    
    let logs;
    try {
      logs = JSON.parse(cleanedData);
    } catch (parseError) {
      console.log('Parse error with cleaned data:', parseError.message);
      // If parsing fails, try with the original data
      try {
        logs = JSON.parse(data);
      } catch (originalError) {
        console.log('Parse error with original data:', originalError.message);
        console.log('Attempting to parse:', data.substring(0, 200));
        throw new Error(`JSON parsing failed: ${originalError.message}. Data preview: ${data.substring(0, 100)}`);
      }
    }
    
    // Normalize paths in the parsed data for cross-platform compatibility
    const normalizedLogs = normalizePaths(logs);
    
    res.json({
      logs: normalizedLogs.reverse(), // Show newest first
      lastModified: stats.mtime.getTime()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to check file status
app.get('/api/logs/status', (req, res) => {
  const { file } = req.query;
  
  if (!file) {
    return res.status(400).json({ error: 'File parameter is required' });
  }
  
  try {
    const logPath = path.resolve(__dirname, file);
    
    const normalizedLogPath = path.normalize(logPath);
    const baseDir = path.resolve(__dirname, '../log_samples');
    const normalizedBaseDir = path.normalize(baseDir);
    
    if (!normalizedLogPath.startsWith(normalizedBaseDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const stats = fs.statSync(logPath);
    
    res.json({
      lastModified: stats.mtime.getTime()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to serve images
app.get('/api/image', (req, res) => {
  const { path: imagePath } = req.query;
  
  if (!imagePath) {
    return res.status(400).json({ error: 'Path parameter is required' });
  }
  
  try {
    let fullPath;
    
    // Handle absolute paths (like /Users/jbe/Dropbox/_outputs/impostor_event_log/...)
    if (path.isAbsolute(imagePath)) {
      fullPath = imagePath;
    } else {
      // Handle relative paths within log_samples
      const relativePath = imagePath.replace(/^.*[/\\]log_samples/, '../log_samples');
      fullPath = path.resolve(__dirname, relativePath);
    }
    
    // Security check - allow images from impostor_event_log or log_samples
    const normalizedFullPath = path.normalize(fullPath);
    const logSamplesDir = path.resolve(__dirname, '../log_samples');
    const normalizedLogSamplesDir = path.normalize(logSamplesDir);
    
    const isAllowed = normalizedFullPath.includes('impostor_event_log') || 
                     normalizedFullPath.startsWith(normalizedLogSamplesDir);
    
    if (!isAllowed) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (fs.existsSync(fullPath)) {
      res.sendFile(fullPath);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});