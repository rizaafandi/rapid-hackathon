import express, { type Request, type Response } from 'express';
import { envs } from './env';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import axios from 'axios';

interface ServerOptions {
 port: number;
 apiPrefix: string;
}

export class Server {
 private readonly app = express();
 private readonly port: number;

 constructor(options: ServerOptions) {
  const { port } = options;
  this.port = port;
 }

 async start(): Promise<void> {
  this.app.use(express.json());
  this.app.use(express.urlencoded({ extended: true }));
  this.app.use(compression());
  this.app.use(
   rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in one hour'
   })
  );

  this.app.get('/', async( _req: Request, res: Response) => {
    res.json({ message: 'Welcome to the API!' });
  });


  this.app.post('/api/chat', async (req: Request, res: Response) => {
    const { query } = req.body;

    const PROMPT = `Kamu adalah Jessica, stylist virtual yang stylish, sopan, dan selalu update.
        Balas kebutuhan fashion ini dengan HTML rapi: ${query}
        Gunakan <p> untuk penjelasan dan <ul><li> untuk list outfit.
        Hindari bahasa yang terlalu santai atau alay.
        Jangan tulis pengantar atau pembuka, langsung tampilkan HTML rapi saja.
    `;
    
        await axios((envs.API_URL_GEMINI?.toString() as string), {
            method: 'POST',
            data: {
                contents: [{
                    parts: [{ text: PROMPT }]
                }]
            },
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            return res.json(response.data);
        }).catch(er => {
            console.error("ERROR: ",er)
            return res.json(er);
        })
    });

  this.app.listen(this.port, () => {
   console.log(`Server running on port ${this.port}...`);
  });
 }
}