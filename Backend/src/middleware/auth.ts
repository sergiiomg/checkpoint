import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';

const SECRET_KEY = JWT_SECRET_KEY;

export function authenticateToken(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers['authorization'];
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
        (req as any).user = user;
        next();
    });
}