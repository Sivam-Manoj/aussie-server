import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define interface for Admin Document
interface IAdmin extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create Admin Schema
const adminSchema = new Schema<IAdmin>(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 6 
    },
    role: { 
      type: String, 
      enum: ['admin', 'superadmin'], 
      default: 'admin' 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre<IAdmin>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create Admin model
const Admin = model<IAdmin>("Admin", adminSchema);

export default Admin; 