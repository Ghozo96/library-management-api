import 'express-async-errors';
import 'reflect-metadata';
import cors from 'cors';
import express from 'express';

import { errorHandler } from './middleware/errorHandler.mw';
import { bookRouter } from './router/book.router';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/books', bookRouter);

app.use(errorHandler);

export default app;
