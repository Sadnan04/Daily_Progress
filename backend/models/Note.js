import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "Untitled" },
    body: { type: String, default: "" },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
