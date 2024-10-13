import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  joinedAt: Date;
  picture?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
  bio?: string;
  saved: Schema.Types.ObjectId[];
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  joinedAt: { type: Date, default: Date.now },
  picture: { type: String, required: true },
  location: { type: String },
  portfolio: { type: String },
  reputation: { type: Number, default: 0 },
  bio: { type: String },
  saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
});

const User = models.User || model("User", UserSchema);

export default User;
