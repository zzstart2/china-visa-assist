/**
 * Express application setup with middleware.
 * Routes are mounted separately in index.ts.
 */
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
