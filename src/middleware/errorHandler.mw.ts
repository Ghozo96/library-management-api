import { NextFunction, Request, Response } from 'express';

import HttpBaseError from '../error/http/HttpBaseError';
import InternalServerError from '../error/http/InternalServerError';

export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof HttpBaseError) {
    res.status(error.statusCode).json({ message: error.message });
  } else {
    const fallbackError = new InternalServerError();
    res.status(fallbackError.statusCode).json({ message: fallbackError.message });
  }
};
