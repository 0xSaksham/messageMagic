import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String, // mongoose has String type and TS has string
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is Required!"],
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: [true, "Email is Required!"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"], //user regexr.com for complex regex or ask chatgpt for basic email validation regex
  },

  password: {
    type: String,
    required: [true, "Password needed!"],
  },

  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },

  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },

  messages: [MessageSchema],
});

// NextJS doesn't know if schema is run or not
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
