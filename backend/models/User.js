import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    time: { type: String, default: "07:00" }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    joinDate: { type: Date, default: Date.now },
    programStartDate: { type: Date, required: true },
    settings: {
      reminders: {
        morning_study: { type: reminderSchema, default: () => ({ enabled: false, time: "07:00" }) },
        coding_session: { type: reminderSchema, default: () => ({ enabled: false, time: "11:00" }) },
        project_time: { type: reminderSchema, default: () => ({ enabled: false, time: "16:00" }) },
        night_review: { type: reminderSchema, default: () => ({ enabled: false, time: "21:00" }) }
      },
      notificationsEnabled: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

userSchema.methods.toSafeObject = function toSafeObject() {
  const o = this.toObject();
  delete o.password;
  return o;
};

export default mongoose.model("User", userSchema);
