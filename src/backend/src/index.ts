import * as dotenv from 'dotenv'
dotenv.config()

import Server from "./app";
import { connectDB } from "./config/database";

const port = +(process.env.PORT || 3000)

const server = new Server(port);
connectDB()
server.start(()=>{
    console.log(`on port ${port}`);
    
})