import { Document, Schema, model } from "mongoose";

// Create the interface
export interface User extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  username: string;
  email: string;
  password: string;
  authProvider: string;
  providerEmail: string;
  avatar: number;
  bio: string;
  admin: boolean;
  createdAt: Date;
  lastLogin: Date;
}

// Create the schema
const UserSchema = new Schema<User>({
  firstName: {
    type: String,
    trim: true,
    maxlength: [25, "First name can not be more then 25 characters"],
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [25, "Last name can not be more then 25 characters"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    maxlength: [25, "Username can not be more then 25 characters"],
    minlength: [3, "Username can not be less then 3 characters"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    maxlength: [255, "Email can not be more then 255 characters"],
    select: false,
  },
  password: {
    type: String,
    unique: false,
    trim: true,
    maxlength: [255, "Password can not be more then 255 characters"],
    minlength: [6, "Password can not be less then 6 characters"],
    select: false,
  },
  authProvider: {
    type: String,
    maxlength: [20, "Provider name can not be more then 20 characters"],
    trim: true,
    select: false,
  },
  providerEmail: {
    type: String,
    trim: true,
    maxlength: [255, "Email can not be more then 255 characters"],
    select: false,
  },
  avatar: {
    type: Number,
    // default: 0,
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [255, "Bio can not be more then 255 characters"],
    select: false,
  },
  admin: {
    type: Boolean,
    default: false,
    select: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

// Schema.pre("save", function (next) {
//   if (this.email) {
//     this.email = this.email.toLowerCase();
//   }
//   if (this.firstName) {
//     this.firstName = this.firstName.toLowerCase();
//   }
//   if (this.lastName) {
//     this.lastName = this.lastName.toLowerCase();
//   }
//   next();
// });

// Schema.pre("remove", function (next) {
//   // 'this' is the client being removed. Provide callbacks here if you want
//   // to be notified of the calls' result.
//   // Sweepstakes.remove({user_id: this._id}).exec();
//   // Submission.remove({client_id: this._id}).exec();
//   next();
// });

// Create and export user model
const User = model<User>("User", UserSchema);
export default User;
