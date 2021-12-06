import ffmpeg from 'fluent-ffmpeg';
import path from "path";
import { uploadsDir } from "./fileHandler";

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const transcodeVideo = async (filePath: string, fileName: string) => {
    const transcodeVideo = path.join(uploadsDir, `${fileName}-360.mp4`);
    return new Promise<void>((resolve, reject) => {
        ffmpeg(filePath)
            .videoCodec("libx264")
            .audioCodec("libmp3lame")
            .size("360x?")
            .on("error", (err: any) => {
                reject(err)
            })
            .on('end', () => {
                resolve();
            })
            .save(transcodeVideo)
    })
}

export default transcodeVideo