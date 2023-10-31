import HttpBaseError from './HttpBaseError';
import { DefaultHttpErrorMessages } from '../messages/DefaultHttpErrorMessages';
import { HttpStatusCode } from '../../constants/HttpStatusCode';

class NotFoundError extends HttpBaseError {
  constructor(message: string = DefaultHttpErrorMessages.NotFoundError) {
    super(HttpStatusCode.NotFound, message);
  }
}

export default NotFoundError;
