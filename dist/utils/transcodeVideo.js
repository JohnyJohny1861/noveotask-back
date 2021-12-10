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
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
fluent_ffmpeg_1.default.setFfmpegPath(ffmpegPath);
const transcodeVideo = (filePath, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const transcodeVideo = path_1.default.join(config_1.UPLOADS_DIR, `${fileName}-360.mp4`);
    return new Promise((resolve, reject) => {
        (0, fluent_ffmpeg_1.default)(filePath)
            .videoCodec("libx264")
            .audioCodec("libmp3lame")
            .size("360x?")
            .on("error", (err) => {
            reject(err);
        })
            .on('end', () => {
            resolve();
        })
            .save(transcodeVideo);
    });
});
exports.default = transcodeVideo;
