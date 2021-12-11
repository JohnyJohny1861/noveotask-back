import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { UPLOADS_DIR } from '../config';

ffmpeg.setFfmpegPath(ffmpegPath.path);

const transcodeVideo = async (filePath: string, fileName: string):Promise<void> => {
    const trsVideo = path.join(UPLOADS_DIR, `${fileName}-360.mp4`);
    return new Promise<void>((resolve, reject) => {
        ffmpeg(filePath)
            .videoCodec('libx264')
            .audioCodec('libmp3lame')
            .size('360x?')
            .on('error', (err: Error) => {
                reject(err);
            })
            .on('end', () => {
                resolve();
            })
            .save(trsVideo);
    });
};

export default transcodeVideo;
