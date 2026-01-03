import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

export default generateToken;
