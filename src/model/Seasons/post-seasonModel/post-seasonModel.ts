// models/PostSeason.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPostSeason extends Document {
  userId: mongoose.Types.ObjectId;
  playerId: mongoose.Types.ObjectId;
  gamesPlayed: number;
  trainingSessions: number;
  recoveryDays: number;
  performance: {
    physical: number;
    technical: number;
    mental: number;
  };
  recoveryChecklist: {
    physicalAssessment: boolean;
    nutritionReview: boolean;
    sleepAnalysis: boolean;
    injuryPreventionPlan: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PostSeasonSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    gamesPlayed: { type: Number, default: 0 },
    trainingSessions: { type: Number, default: 0 },
    recoveryDays: { type: Number, default: 0 },
    performance: {
      physical: { type: Number, default: 0 }, // percentage
      technical: { type: Number, default: 0 },
      mental: { type: Number, default: 0 },
    },
    recoveryChecklist: {
      physicalAssessment: { type: Boolean, default: false },
      nutritionReview: { type: Boolean, default: false },
      sleepAnalysis: { type: Boolean, default: false },
      injuryPreventionPlan: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PostSeason ||
  mongoose.model<IPostSeason>("PostSeason", PostSeasonSchema);
