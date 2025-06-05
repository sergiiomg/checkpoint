import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';

const SECRET_KEY = JWT_SECRET_KEY;

export function authenticateToken(req: Request, res: Response, next: NextFunction){
    console.log("Headers recibidos:", req.headers);
    const authHeader = req.headers['authorization'];
    console.log("Auth header:", authHeader);
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        res.status(401).json({error: 'Token requerido'});
        return;
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err){
            res.status(403).json({error: 'Token invalido'});
            return;
        }
        console.log("👤 JWT Payload completo:", user); // 🔍 AGREGA ESTA LÍNEA
        console.log("👤 Usuario ID del token:", (user as any)?.id); // 🔍 Y ESTA
        (req as any).user = user;
        next();
    });
}