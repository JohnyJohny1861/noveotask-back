import multer, { StorageEngine, Multer } from 'multer';
import uniqid from 'uniqid';
import { Request } from "express";
import path from "path";
import fs from "fs";
import { UPLOADS_DIR } from "../config.js"

const storage: StorageEngine = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        cb: Function
    ): void => {        
        fs.exists(UPLOADS_DIR, (exists: Boolean): void => {
            if (!exists)
                fs.mkdir(UPLOADS_DIR, (err) => {
                    if (err) cb(null, false);
                    else cb(null, UPLOADS_DIR);
                });
            else {
                cb(null, UPLOADS_DIR);
            }
        });

    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        cb: Function): void => {
            const uploadedFileName = uniqid(file.filename + new Date().getTime()) + path.extname(file.originalname);
            cb(null, uploadedFileName);
        }
});

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: Function): void => {
    const extensionFile: string = file.originalname.replace('.', '');
    const isVideo = /(mkv|webm|mp4|wmv|avi)/gi.test(extensionFile);

    if (isVideo)
		cb(null, true);
	else 
        cb('File format is not valid', false);

};

const fileHandler = multer({ storage, fileFilter }) as Multer;

export default fileHandler;