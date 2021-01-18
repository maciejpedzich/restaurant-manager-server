import BaseHttpError from './base-http';

export default class EmailRegisteredError extends BaseHttpError {
  constructor() {
    super(409, 'This email address has already been registered');
  }
}
