import BaseHttpError from './base-http';

export default class MissingPermissionsError extends BaseHttpError {
	constructor() {
		super(403, "You don't have permissions to proceed");
	}
}
