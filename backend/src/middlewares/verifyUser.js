import { env } from "../utils/index.js"
import jwt from 'jsonwebtoken';

export const verifyUser = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token not provided! Please Sign In"
        })
    }

    let data;

    try {
        data = jwt.verify(token, env.JWT_SECRET)

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token not provided! Please Sign In"
        })
    }

    if (!data) {
        return res.status(401).json({
            success: false,
            message: "Token not provided! Please Sign In"
        })
    }

    req.user = data
    next()
}