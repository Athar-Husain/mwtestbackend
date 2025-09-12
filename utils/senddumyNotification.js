import { Schema } from "mongoose";

// utils/sendNotification.js
const senddumyNotification = async (userId, payload) => {
  console.log(`🔔 [MOCK NOTIFICATION] To User: ${userId}`);
  console.log(`📨 Title: ${payload.title}`);
  console.log(`📄 Body: ${payload.body}`);
  return { success: true };
};

export default senddumyNotification;
export const supportTicketSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  setupBox: {
    type: Schema.Types.ObjectId,
    ref: "SetupBox",
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  assignmentHistory: [
    {
      assignedTo: { type: Types.ObjectId, ref: "Team" },
      assignedAt: { type: Date, default: Date.now },
    },
  ],
  issueType: {
    type: String,
    enum: ["connection", "hardware", "billing", "other"],
    default: "other",
  },
  description: {
    type: String,
    required: true,
  },
  priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
  status: {
    type: String,
    enum: ["pending", "in_progress", "resolved", "escalated"],
    default: "pending",
  },
  escalated: { type: Boolean, default: false },
  assignedTo: { type: Types.ObjectId, ref: "Team" },
  comments: [{ type: Types.ObjectId, ref: "Comment" }],
  attachments: [{ type: Types.ObjectId, ref: "Attachment" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
});
