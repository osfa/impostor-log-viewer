import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

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
    
    // Security check - ensure file is within allowed directory
    if (!logPath.includes('log_samples')) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const stats = fs.statSync(logPath);
    const data = fs.readFileSync(logPath, 'utf8');
    const logs = JSON.parse(data);
    
    res.json({
      logs: logs.reverse(), // Show newest first
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
    
    if (!logPath.includes('log_samples')) {
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
      const relativePath = imagePath.replace(/^\/.*?log_samples/, '../log_samples');
      fullPath = path.resolve(__dirname, relativePath);
    }
    
    // Security check - allow images from impostor_event_log or log_samples
    const isAllowed = fullPath.includes('impostor_event_log') || fullPath.includes('log_samples');
    
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