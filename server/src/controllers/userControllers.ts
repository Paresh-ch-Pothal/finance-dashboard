import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel";

interface AuthRequest extends Request {
  user?: any;
}

// Get all users (Admin only)
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await userModel.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update user role / status (Admin only)
export const updateUser = async (req: AuthRequest, res: Response) => {
  const { role, isActive } = req.body;
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (role) user.role = role;
    if (typeof isActive === "boolean") user.isActive = isActive;

    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a user (Admin only)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};