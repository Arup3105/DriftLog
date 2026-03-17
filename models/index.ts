import mongoose, { Schema, model, models } from "mongoose";

// User
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    githubToken: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);

// Repo
const RepoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: String, required: true },
    name: { type: String, required: true },
    branch: { type: String, default: "main" },
    fullName: { type: String, required: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    lastChecked: { type: Date },
    driftStatus: {
      type: String,
      enum: ["clean", "drifted", "unknown"],
      default: "unknown",
    },
    deployedSnapshot: {
      commitSHA: { type: String, default: "" },
      tree: [{ path: String, sha: String }],
      snapshotAt: { type: Date },
    },
  },
  { timestamps: true }
);

export const Repo = models.Repo || model("Repo", RepoSchema);

// DriftLog
const DriftLogSchema = new Schema(
  {
    repoId: { type: Schema.Types.ObjectId, ref: "Repo", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["clean", "drifted", "unknown"] },
    driftedFiles: [
      {
        path: String,
        status: { type: String, enum: ["added", "removed", "modified", "unchanged"] },
        currentSHA: String,
        deployedSHA: String,
      },
    ],
    totalFiles: Number,
    behindBy: Number,
    currentCommitSHA: String,
    deployedCommitSHA: String,
    checkedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const DriftLog = models.DriftLog || model("DriftLog", DriftLogSchema);
