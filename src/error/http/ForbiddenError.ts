import HttpBaseError from './HttpBaseError';
import { DefaultHttpErrorMessages } from '../messages/DefaultHttpErrorMessages';
import { HttpStatusCode } from '../../constants/HttpStatusCode';

class ForbiddenError extends HttpBaseError {
  constructor(message: string = DefaultHttpErrorMessages.ForbiddenError) {
    super(HttpStatusCode.Forbidden, message);
  }
}

export default ForbiddenError;
