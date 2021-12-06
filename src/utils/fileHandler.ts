import multer, { StorageEngine, Multer } from 'multer';
import uniqid from 'uniqid';
import { Request } from "express";
import path from "path";
import fs from "fs";

export const uploadsDir = path.join(process.cwd(), "uploads");

const storage: StorageEngine = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        cb: Function
    ): void => {        
        if (!fs.existsSync(uploadsDir))
            fs.mkdirSync(uploadsDir);

        cb(null, uploadsDir);
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        cb: Function): void => {
        
        const uploadedFileName = uniqid(file.filename + new Date().getTime()) + path.extname(file.originalname);
        // const uploadedFileName = file.originalname;

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