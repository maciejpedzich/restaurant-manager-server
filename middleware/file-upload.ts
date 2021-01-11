import multer, { diskStorage } from 'multer';
import StringMap from '../interfaces/string-map';

const MIMETYPE_MAP: StringMap<string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png'
};

const storage = diskStorage({
	destination(req, file, cb) {
		cb(null, 'public');
	},
	filename(req, file, cb) {
		const uploadTimestamp = new Date().getTime();
		const extension = MIMETYPE_MAP[file.mimetype];

		cb(null, `${file.fieldname}-${uploadTimestamp}.${extension}`);
	}
});

const fileUploadMiddleware = multer({
	storage,
	fileFilter(req, file, cb) {
		cb(null, Object.keys(MIMETYPE_MAP).includes(file.mimetype));
	}
});

export default fileUploadMiddleware;
