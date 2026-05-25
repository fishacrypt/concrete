const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── CONFIG ───────────────────────────────────────────
const API_KEY = process.env.ANTHROPIC_API_KEY || 'YOUR_API_KEY_HERE';
const PORT    = process.env.PORT || 3000;
// ──────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  // ── Proxy API calls ──────────────────────────────────
  if (req.method === 'POST' && req.url === '/api/claude') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(body)
        }
      };
      const proxy = https.request(options, apiRes => {
        res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
        apiRes.pipe(res);
      });
      proxy.on('error', err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: err.message } }));
      });
      proxy.write(body);
      proxy.end();
    });
    return;
  }

  // ── Serve index.html ─────────────────────────────────
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const file = path.join(__dirname, 'index.html');
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n  ┌─────────────────────────────────────────┐`);
  console.log(`  │  Concrete XYZ Profile Explorer          │`);
  console.log(`  │  Running at http://localhost:${PORT}        │`);
  console.log(`  └─────────────────────────────────────────┘\n`);
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.log('  ⚠  No API key set!');
    console.log('  Set it with: ANTHROPIC_API_KEY=sk-ant-... node server.js\n');
  }
});
