import fs from 'fs';
import uniqid from 'uniqid';
import express, { Application, Request, Response, NextFunction } from "express";
import fileHandler, { uploadsDir } from "./utils/fileHandler";
import transcodeVideo from './utils/transcodeVideo';
import cors from './utils/cors';


const port = process.env.PORT ? process.env.PORT : 3655;
const app: Application = express();


const upload = fileHandler.single("video");
app.use("/uploads", express.static(uploadsDir));
app.use(cors);

app.post("/upload", ( req: Request, res: Response ): void => {
    upload(req, res, async err => {
        if (!err && req.file) {
            const filePath = req.file.path;
            let fileName = req.file.originalname.split('.')[0];
            if(filePath && fileName) {
                fileName = `${fileName}===${uniqid()}`;
                await transcodeVideo(filePath, fileName);
                fs.unlink(filePath, err => err ? console.log(err) : null)
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
    });
});

app.get("/files", (req: Request, res: Response): void => {
    fs.readdir(uploadsDir, (err, files) => {
        if(!err)  {
            let baseUrl = `${req.protocol}://${req.hostname}:${port}`;
            let videoFiles = files.map(file => {
                return {
                    id: uniqid(),
                    url: `${baseUrl}/uploads/${file}`,
                    name: file.split('===')[0]
                }
            })
            res.status(200).json(videoFiles)
        } else {
            console.log(err);
            res.status(200).json([])
        }
    });   
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello World");
});


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));