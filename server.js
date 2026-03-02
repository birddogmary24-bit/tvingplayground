const http = require('http');
const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'dist');

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);
  if (!fs.existsSync(filePath)) filePath = path.join(distDir, 'index.html');
  const ext = path.extname(filePath);
  res.setHeader('Content-Type', mime[ext] || 'text/plain');
  fs.createReadStream(filePath).pipe(res);
});

server.listen(3000, '0.0.0.0', () => console.log('Server running on http://localhost:3000'));
