import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Tracker from "../models/Tracker.js";

const REMINDER_IDS = ["morning_study", "coding_session", "project_time", "night_review"];

export async function updateProfile(req, res) {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (name !== undefined) user.name = String(name).trim();
    if (email !== undefined) {
      const e = String(email).toLowerCase().trim();
      const taken = await User.findOne({ email: e, _id: { $ne: user._id } });
      if (taken) return res.status(409).json({ error: "Email already in use" });
      user.email = e;
    }
    await user.save();
    return res.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Update failed" });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters" });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ error: "Current password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Password change failed" });
  }
}

export async function updateSettings(req, res) {
  try {
    const { reminders, notificationsEnabled } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (reminders && typeof reminders === "object") {
      for (const key of REMINDER_IDS) {
        const val = reminders[key];
        if (!val || typeof val !== "object") continue;
        if (!user.settings.reminders[key]) {
          user.settings.reminders[key] = { enabled: false, time: "08:00" };
        }
        if (typeof val.enabled === "boolean") user.settings.reminders[key].enabled = val.enabled;
        if (typeof val.time === "string") user.settings.reminders[key].time = val.time;
      }
    }
    if (typeof notificationsEnabled === "boolean") {
      user.settings.notificationsEnabled = notificationsEnabled;
    }
    await user.save();
    return res.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Settings update failed" });
  }
}

export async function resetProgress(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    user.programStartDate = d;
    await user.save();
    let tracker = await Tracker.findOne({ userId: user._id });
    if (!tracker) {
      tracker = await Tracker.create({ userId: user._id, tasks: {} });
    } else {
      tracker.tasks = {};
      tracker.markModified("tasks");
      await tracker.save();
    }
    return res.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Reset failed" });
  }
}
