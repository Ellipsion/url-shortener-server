import { NextFunction, Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies["auth-token"];

    if (!token) {
        return res.status(401).json({error: "Unauthorized: Missing Token"});
    }

    try {
        // decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userId = (decoded as JwtPayload).userId;
        

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({error: "Unauthorized: Invalid Token"});
    }
}