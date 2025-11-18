import express from 'express';
import cors from 'cors';
import { routerTurnos } from './routes/turnos.route';
import { routerUsuarios } from './routes/usuarios.route'

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
        this.app.use('/api/turnos', routerTurnos)
        this.app.use('/api/usuarios', routerUsuarios)
    }
    start(callback: () => void) {
        this.app.listen(this.port, callback);
    }
}

export default Server;