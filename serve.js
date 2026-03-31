const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Proxy /api to backend — use a middleware function for Express 5 compat
const apiProxy = createProxyMiddleware({
  target: 'http://127.0.0.1:3001',
  changeOrigin: true,
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return apiProxy(req, res, next);
  }
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'client/dist')));

// SPA fallback
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log('Visa Demo running on http://0.0.0.0:' + PORT);
});
