import BaseHttpError from './base-http';

export default class InvalidDataError extends BaseHttpError {
  constructor(message: string) {
    super(422, message);
  }
}
