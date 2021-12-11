import multer, { StorageEngine, Multer, FileFilterCallback } from 'multer';
import uniqid from 'uniqid';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { UPLOADS_DIR } from '../config';

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback): void => {
        fs.exists(UPLOADS_DIR, (exists: boolean): void => {
            if (!exists) {
                fs.mkdir(UPLOADS_DIR, (err) => {
                    if (err) cb(null, '');
                    else cb(null, UPLOADS_DIR);
                });
            } else {
                cb(null, UPLOADS_DIR);
            }
        });
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback): void => {
        const uploadedFileName = (
            uniqid(file.filename + new Date().getTime())
            + path.extname(file.originalname)
        );
        cb(null, uploadedFileName);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const extensionFile: string = file.originalname.replace('.', '');
    const isVideo = /(mkv|webm|mp4|wmv|avi)/gi.test(extensionFile);

    if (isVideo) cb(null, true);
	else { cb(null, false); }
};

const fileHandler = multer({ storage, fileFilter }) as Multer;

export default fileHandler;
