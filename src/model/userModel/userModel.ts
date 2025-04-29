import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define an interface for the User Document
interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationCode: string;
  verificationCodeExpiresAt: Date;
  isProfileDone: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create the User Schema
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    isVerified: { type: Boolean, required: false, default: false },
    verificationCode: { type: String, required: false },
    verificationCodeExpiresAt: { type: Date, required: false },
    isProfileDone: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

// 🔒 Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Virtual method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create User model
const User = model<IUser>("User", userSchema);

export default User;
