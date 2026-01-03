"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await User_1.default.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: (0, generateToken_1.default)(user._id.toString()),
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (user && (await bcryptjs_1.default.compare(password, user.password || ""))) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: (0, generateToken_1.default)(user._id.toString()),
            });
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.loginUser = loginUser;
const getUserProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                addresses: user.addresses,
            });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserProfile = getUserProfile;
