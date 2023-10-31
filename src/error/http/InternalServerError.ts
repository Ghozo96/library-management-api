import HttpBaseError from './HttpBaseError';
import { DefaultHttpErrorMessages } from '../messages/DefaultHttpErrorMessages';
import { HttpStatusCode } from '../../constants/HttpStatusCode';

class InternalServerError extends HttpBaseError {
  constructor(message: string = DefaultHttpErrorMessages.InternalServerError) {
    super(HttpStatusCode.InternalServer, message);
  }
}

export default InternalServerError;
