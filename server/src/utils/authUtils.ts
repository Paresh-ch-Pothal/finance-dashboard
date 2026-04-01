import jwt from "jsonwebtoken";
import bycrypt from "bcryptjs";


export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });
};

export const comparePassword = async (enteredPassword: string, hashedPassword: string) => {
  return bycrypt.compare(enteredPassword, hashedPassword);
}

export const ConvertHashPassword = (password: string) => {
  const salt = bycrypt.genSaltSync(10);
  return bycrypt.hashSync(password, salt);
}
