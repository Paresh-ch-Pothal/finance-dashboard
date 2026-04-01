import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import { comparePassword, ConvertHashPassword, generateToken } from "../utils/authUtils";


// Register
export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = ConvertHashPassword(password);
    const user = await userModel.create({ name, email, password: hashedPassword, role });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id as any),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.isActive === false) {
        return res.status(403).json({ message: "Account is deactivated. Please contact admin." });
    }

    const isMatch = await comparePassword(password , user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id as any),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};