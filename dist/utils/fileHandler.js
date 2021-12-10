"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const uniqid_1 = __importDefault(require("uniqid"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_js_1 = require("../config.js");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        fs_1.default.exists(config_js_1.UPLOADS_DIR, (exists) => {
            if (!exists)
                fs_1.default.mkdir(config_js_1.UPLOADS_DIR, (err) => {
                    if (err)
                        cb(null, false);
                    else
                        cb(null, config_js_1.UPLOADS_DIR);
                });
            cb(null, config_js_1.UPLOADS_DIR);
        });
    },
    filename: (req, file, cb) => {
        const uploadedFileName = (0, uniqid_1.default)(file.filename + new Date().getTime()) + path_1.default.extname(file.originalname);
        cb(null, uploadedFileName);
    }
});
const fileFilter = (req, file, cb) => {
    const extensionFile = file.originalname.replace('.', '');
    const isVideo = /(mkv|webm|mp4|wmv|avi)/gi.test(extensionFile);
    if (isVideo)
        cb(null, true);
    else
        cb('File format is not valid', false);
};
const fileHandler = (0, multer_1.default)({ storage, fileFilter });
exports.default = fileHandler;
