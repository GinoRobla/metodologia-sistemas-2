import Server from "./app";
import { connectDB } from "./config/database";
                        //ENV
const server = new Server(3000);

connectDB()
server.start(()=>{
    console.log("on port 3000");
    
})