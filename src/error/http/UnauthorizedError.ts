import HttpBaseError from './HttpBaseError';
import { DefaultHttpErrorMessages } from '../messages/DefaultHttpErrorMessages';
import { HttpStatusCode } from '../../constants/HttpStatusCode';

class UnauthorizedError extends HttpBaseError {
  constructor(message: string = DefaultHttpErrorMessages.UnauthorizedError) {
    super(HttpStatusCode.Unauthorized, message);
  }
}

export default UnauthorizedError;
