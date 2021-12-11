import fs from 'fs';
import uniqid from 'uniqid';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import fileHandler from './utils/fileHandler';
import { UPLOADS_DIR, PORT } from './config';
import transcodeVideo from './utils/transcodeVideo';

const app: Application = express();

const upload = fileHandler.single('video');
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(cors());

app.post('/upload', (req: Request, res: Response): void => {
    upload(req, res, async (error) => {
        if (!error && req.file) {
            const filePath = req.file.path;
            const dotIndex = req.file.originalname.lastIndexOf('.');
            let fileName = req.file.originalname.slice(0, dotIndex);
            if (filePath && fileName) {
                fileName = `${fileName}===${uniqid()}`;
                await transcodeVideo(filePath, fileName);
                fs.unlink(filePath, () => null);
                res.status(200).json({ message: 'Uploaded' });
            } else {
                res.status(500).json('Internal server error');
            }
        } else if (error.message) res.status(422).json(error.message);
        else res.status(500).json('Internal server error');
    });
});

app.get('/files', (req: Request, res: Response): void => {
    fs.readdir(UPLOADS_DIR, (err, files) => {
        if (!err) {
            const baseUrl = `${req.protocol}://${req.hostname}:${PORT}`;
            const videoFiles = files.map((file) => ({
                    id: uniqid(),
                    url: `${baseUrl}/uploads/${file}`,
                    name: file.split('===')[0],
                }));
            res.status(200).json(videoFiles);
        } else {
            res.status(200).json([]);
        }
    });
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
