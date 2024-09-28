// dotenv config must be imported before sentry
import * as Sentry from '@sentry/node';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/../.env' });

// sentry config must be imported before express
import './app/config/sentry.config';

import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from '../build/routes';
import * as swaggerDocument from '../build/swagger.json';
import { createQueueController } from './app/controllers/admin/QueuesController';

export default async () => {
  const app = express();
  app.use(express.json());


  const serverAdapter = createQueueController('/admin/queues');
  app.get('/', (req, res) => res.status(200).send('Hello World'));
  app.use('/admin/queues', serverAdapter.getRouter());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
  RegisterRoutes(app);

  Sentry.setupExpressErrorHandler(app);

  app.use(function onError(err: Error, req: Request, res: Response, next: NextFunction) {
    res.statusCode = 500;
    res.end((res as Response & { sentry: unknown}).sentry + "\n");
  });
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}
