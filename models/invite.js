import mongoose from "mongoose";
const Schema = mongoose.Schema;

const InvitesSchema = new Schema(
  {
    guest: String,
    email: String
  },
  { timestamps: true }
);

export default mongoose.model("Invite", InvitesSchema);
