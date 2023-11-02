import HttpBaseError from './HttpBaseError';
import { DefaultHttpErrorMessages } from '../messages/DefaultHttpErrorMessages';
import { HttpStatusCode } from '../../constants/HttpStatusCode';

class BadRequestError extends HttpBaseError {
  constructor(message: string = DefaultHttpErrorMessages.BadRequestError) {
    super(HttpStatusCode.BadRequest, message);
  }
}

export default BadRequestError;
