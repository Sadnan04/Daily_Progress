import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Tracker from "../models/Tracker.js";

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const hash = await bcrypt.hash(password, 12);
    const programStartDate = new Date();
    programStartDate.setHours(0, 0, 0, 0);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      programStartDate
    });
    await Tracker.create({ userId: user._id, tasks: {} });
    const token = signToken(user._id.toString());
    return res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Sign up failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    let tracker = await Tracker.findOne({ userId: user._id });
    if (!tracker) {
      tracker = await Tracker.create({ userId: user._id, tasks: {} });
    }
    const token = signToken(user._id.toString());
    return res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load user" });
  }
}
