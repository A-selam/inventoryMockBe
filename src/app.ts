import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { delayMiddleware, errorHandler, notFoundHandler } from './middleware';
import router from './routes';
import { initializeDatabase } from './mock-db';

initializeDatabase();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(delayMiddleware);

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
