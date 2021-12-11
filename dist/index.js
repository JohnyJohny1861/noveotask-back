"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
const express_1 = __importDefault(require("express"));
const fileHandler_1 = __importDefault(require("./utils/fileHandler"));
const config_1 = require("./config");
const transcodeVideo_1 = __importDefault(require("./utils/transcodeVideo"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const upload = fileHandler_1.default.single("video");
app.use("/uploads", express_1.default.static(config_1.UPLOADS_DIR));
app.use((0, cors_1.default)());
app.post("/upload", (req, res) => {
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (!err && req.file) {
            const filePath = req.file.path;
            let dotIndex = req.file.originalname.lastIndexOf('.');
            let fileName = req.file.originalname.slice(0, dotIndex);
            if (filePath && fileName) {
                fileName = `${fileName}===${(0, uniqid_1.default)()}`;
                yield (0, transcodeVideo_1.default)(filePath, fileName);
                fs_1.default.unlink(filePath, err => err ? console.log(err) : null);
                res.status(200).json({ message: "Uploaded" });
            }
            else {
                res.status(500).json('Internal server error');
            }
        }
        else {
            console.log(err);
            err.message ?
                res.status(422).json(err.message) :
                res.status(500).json('Internal server error');
        }
    }));
});
app.get("/files", (req, res) => {
    fs_1.default.readdir(config_1.UPLOADS_DIR, (err, files) => {
        if (!err) {
            let baseUrl = `${req.protocol}://${req.hostname}:${config_1.PORT}`;
            let videoFiles = files.map(file => {
                return {
                    id: (0, uniqid_1.default)(),
                    url: `${baseUrl}/uploads/${file}`,
                    name: file.split('===')[0]
                };
            });
            res.status(200).json(videoFiles);
        }
        else {
            console.log(err);
            res.status(200).json([]);
        }
    });
});
app.get('/', (req, res, next) => {
    res.send("Hello World");
});
app.listen(config_1.PORT, () => console.log(`Server running on http://localhost:${config_1.PORT}`));
