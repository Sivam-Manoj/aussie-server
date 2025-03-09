import { Schema, model, Document } from 'mongoose';

// Define an interface for TypeScript type safety
interface IPlayer extends Document {
  _id: string;
  photo: string; // Image path
  fullName: string;
  nickname: string;
  email: string;
  mobilePhone: string;
  dob: Date;
  height: number; // cm or inches
  weight: number; // kg or lbs
  startedPlaying: Date;
  preferredFoot: 'Left' | 'Right' | 'Both';
  preferredHandball: 'Left' | 'Right' | 'Both';
  preferredTap: 'Left' | 'Right' | 'Both' | 'Neither';
  primaryPosition:
    | 'Forward'
    | 'Midfield'
    | 'Defender'
    | 'Ruck'
    | 'Utility'
    | 'Winger'
    | 'Tagger'
    | 'Bench'
    | 'Other';
  secondaryPosition: IPlayer['primaryPosition'];
  preferredPosition: IPlayer['primaryPosition'];
  playingStyle:
    | 'Aggressive'
    | 'Strategic'
    | 'Balanced'
    | 'Defensive'
    | 'Attacking'
    | 'Playmaker'
    | 'Reactive'
    | 'Cautious'
    | 'Other';
  currentClub: string;
  previousClubs: string[];
  yearsOfExperience: number;
  gamesPlayed: number;
  goalsKicked: number;
  aspirations:
    | 'Social Player'
    | 'Club Player'
    | 'Professional'
    | 'Elite Athlete'
    | 'Fitness Aspect'
    | 'Personal Development'
    | 'Mental Activity'
    | 'Financial Requirement'
    | 'Other';
  achievements: string[];
  injuryHistory: string;
  socialMediaLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
  };
  playerProfile: 'Public' | 'Private';
  biography: string;
}

// Define the Mongoose Schema
const playerSchema = new Schema<IPlayer>(
  {
    photo: { type: String, required: false },
    fullName: { type: String, required: true },
    nickname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    mobilePhone: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    startedPlaying: { type: Date, required: true },
    preferredFoot: {
      type: String,
      enum: ['Left', 'Right', 'Both'],
      required: true,
    },
    preferredHandball: {
      type: String,
      enum: ['Left', 'Right', 'Both'],
      required: true,
    },
    preferredTap: {
      type: String,
      enum: ['Left', 'Right', 'Both', 'Neither'],
      required: true,
    },
    primaryPosition: {
      type: String,
      enum: [
        'Forward',
        'Midfield',
        'Defender',
        'Ruck',
        'Utility',
        'Winger',
        'Tagger',
        'Bench',
        'Other',
      ],
      required: true,
    },
    secondaryPosition: {
      type: String,
      enum: [
        'Forward',
        'Midfield',
        'Defender',
        'Ruck',
        'Utility',
        'Winger',
        'Tagger',
        'Bench',
        'Other',
      ],
      required: true,
    },
    preferredPosition: {
      type: String,
      enum: [
        'Forward',
        'Midfield',
        'Defender',
        'Ruck',
        'Utility',
        'Winger',
        'Tagger',
        'Bench',
        'Other',
      ],
      required: true,
    },
    playingStyle: {
      type: String,
      enum: [
        'Aggressive',
        'Strategic',
        'Balanced',
        'Defensive',
        'Attacking',
        'Playmaker',
        'Reactive',
        'Cautious',
        'Other',
      ],
      required: true,
    },
    currentClub: { type: String, required: true },
    previousClubs: { type: [String], required: false },
    yearsOfExperience: { type: Number, required: true },
    gamesPlayed: { type: Number, required: true },
    goalsKicked: { type: Number, required: true },
    aspirations: {
      type: String,
      enum: [
        'Social Player',
        'Club Player',
        'Professional',
        'Elite Athlete',
        'Fitness Aspect',
        'Personal Development',
        'Mental Activity',
        'Financial Requirement',
        'Other',
      ],
      required: true,
    },
    achievements: { type: [String], required: false },
    injuryHistory: { type: String, required: false },
    socialMediaLinks: {
      facebook: { type: String, required: false },
      instagram: { type: String, required: false },
      linkedin: { type: String, required: false },
      whatsapp: { type: String, required: false },
    },
    playerProfile: {
      type: String,
      enum: ['Public', 'Private'],
      required: true,
    },
    biography: { type: String, required: false },
  },
  { timestamps: true }
);

// Create and export the model
const Player = model<IPlayer>('Player', playerSchema);
export default Player;
