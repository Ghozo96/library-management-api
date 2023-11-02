import { HttpStatusCode } from '../../constants/HttpStatusCode';

class HttpBaseError extends Error {
  readonly statusCode: HttpStatusCode;

  constructor(statusCode: HttpStatusCode, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this);
  }
}

export default HttpBaseError;
