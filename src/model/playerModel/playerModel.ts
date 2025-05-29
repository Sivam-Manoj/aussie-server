import mongoose, { Schema, model, Document } from "mongoose";

// Define social media links interface
interface ISocialMediaLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  whatsapp?: string;
  [key: string]: string | undefined; // Allow dynamic properties
}

// Define an interface for TypeScript type safety
export interface IPlayer extends Document {
  _id: string;
  photo: string;
  fullName: string;
  user: mongoose.Types.ObjectId;
  nickname: string;
  email: string;
  mobilePhone: string;
  dob: Date | null;
  height: number | null;
  weight: number | null;
  startedPlaying: Date | null;
  preferredFoot: "Left" | "Right" | "Both" | "";
  preferredHandball: "Left" | "Right" | "Both" | "";
  preferredTap: "Left" | "Right" | "Both" | "Neither" | "";
  primaryPosition: string;
  secondaryPosition: string;
  preferredPosition: string;
  playingStyle: string;
  currentClub: string;
  previousClubs: string[];
  yearsOfExperience: number;
  gamesPlayed: number;
  goalsKicked: number;
  aspirations: string;
  achievements: string[];
  injuryHistory: string;
  socialMediaLinks: ISocialMediaLinks;
  playerProfile: "Public" | "Private";
  biography: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose Schema
const socialMediaSchema = new Schema<ISocialMediaLinks>({
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  whatsapp: { type: String, default: '' }
}, { _id: false });

const playerSchema = new Schema<IPlayer>(
  {
    photo: { type: String, default: '' },
    fullName: { type: String, required: [true, 'Full name is required'] },
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: [true, 'User reference is required']
    },
    nickname: { type: String, default: '' },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    mobilePhone: { 
      type: String, 
      default: '',
      match: [/^[0-9\-\+\s()]*$/, 'Please enter a valid phone number']
    },
    dob: { type: Date },
    height: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    startedPlaying: { type: Date },
    preferredFoot: {
      type: String,
      enum: ['Left', 'Right', 'Both', ''],
      default: ''
    },
    preferredHandball: {
      type: String,
      enum: ['Left', 'Right', 'Both', ''],
      default: ''
    },
    preferredTap: {
      type: String,
      enum: ['Left', 'Right', 'Both', 'Neither', ''],
      default: ''
    },
    primaryPosition: { type: String, default: '' },
    secondaryPosition: { type: String, default: '' },
    preferredPosition: { type: String, default: '' },
    playingStyle: { type: String, default: '' },
    currentClub: { type: String, default: '' },
    previousClubs: { type: [String], default: [] },
    yearsOfExperience: { type: Number, default: 0, min: 0 },
    gamesPlayed: { type: Number, default: 0, min: 0 },
    goalsKicked: { type: Number, default: 0, min: 0 },
    aspirations: { type: String, default: '' },
    achievements: { type: [String], default: [] },
    injuryHistory: { type: String, default: '' },
    socialMediaLinks: { type: socialMediaSchema, default: () => ({}) },
    playerProfile: {
      type: String,
      enum: ['Public', 'Private'],
      default: 'Public'
    },
    biography: { type: String, default: '' },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
playerSchema.index({ user: 1 });
playerSchema.index({ email: 1 }, { unique: true });

// Update the updatedAt field before saving
playerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create and export the model
const Player = model<IPlayer>("Player", playerSchema);
export default Player;
