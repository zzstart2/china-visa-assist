/**
 * Server entry point — env, middleware, routes, listen.
 */
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { mountRoutes } from './routes';

const PORT = 3001;

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

mountRoutes(app);

app.listen(PORT, () => {
  console.log(`🇨🇳 Visa Mock Server running on http://localhost:${PORT}`);
  console.log(`   CORS enabled for all origins`);
});

export default app;
