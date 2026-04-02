/**
 * Route aggregator — mounts all sub-routers on the Express app.
 */
import { Express } from 'express';
import visaTypeRouter from './visaType';
import uploadRouter from './upload';
import validateRouter from './validate';
import chatRouter from './chat';
import summaryRouter from './summary';
import exportRouter from './export';

export function mountRoutes(app: Express): void {
  app.use(visaTypeRouter);
  app.use(uploadRouter);
  app.use(validateRouter);
  app.use(chatRouter);
  app.use(summaryRouter);
  app.use(exportRouter);
}
