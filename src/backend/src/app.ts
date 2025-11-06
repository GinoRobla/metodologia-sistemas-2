import express from 'express';
import cors from 'cors';

class Server {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.port = port;
        this.app = express();
        this.middlewares();
        this.routes();
        
    }
    middlewares(){
        this.app.use(express.json({limit: '150mb'}));
        //cors
        this.app.use( cors());
    }
    routes(){
        this.app.get('/health', (_req, res) => res.json({ ok: true }));
    }
    start(callback: () => void) {
        this.app.listen(this.port, callback);
    }
}

export default Server;