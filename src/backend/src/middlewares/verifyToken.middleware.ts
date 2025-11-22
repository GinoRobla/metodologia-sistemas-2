import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayLoadCustom{
    userName: string,
    userEmail: string,
    tipoUsuario: string
}

const verifyTokenMiddleware = (req:Request, res:Response, next: NextFunction) => {

    const authHeader = req.header('authorization')
    if(!authHeader){
        return res.status(401).json({message: 'Token de acceso no proporcionado'})
    }
    const token = authHeader

    try{                                  //ENV
        const decoded = jwt.verify(token, 'palabraSecreta') as JwtPayLoadCustom
        (req as any).user = decoded
        next()
        
    }catch(error){
        if(error instanceof Error){
            res.status(401).json({message: error.message})
        }
    }
}

export default verifyTokenMiddleware