import { Request, Response } from "express";
import { UserModel } from "../models/user";
import { generateToken, signToken } from "../utils/token";


// @desc Register new user
// @route post /auth/register
// @access Public
export const registerUser = async (req: Request, res: Response) => {
    try {
        const {email, name, password} = req.body;

        const existingUser = await UserModel.findOne({email});

        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        const user = await UserModel.create({
            name, email, password
        });

        signToken(res, user.id);

        res.status(201).json({user: user.json(), message: "Logged in successfully!"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
};

// @desc provide token and login
// @route POST /auth/login
// @access Public
export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        const user = await UserModel.findOne({email});

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        const isPasswordValid = await user.matchPassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid username or password"});
        }

        signToken(res, user.id);

        res.send({user: user.json(), message: 'User authenticated successfully'});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

// @desc verify token
// @route GET /auth/verify
// @access Public
export const verify =  async (req: Request, res: Response) => {
    res.status(200).send({userId: req.userId});
};

// @desc Logout
// @route GET /auth/logout
// @access Public
export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("auth-token");
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}