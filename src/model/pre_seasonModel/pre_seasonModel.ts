import mongoose, { Schema, Document } from "mongoose";

interface IPreSeason extends Document {
  playerId: mongoose.Schema.Types.ObjectId;
  season: string;
  aerobicEnduranceTest: object;
  speedAgilityTest: object;
  strengthTest: object;
  flexibilityMobility: string;
  bodyFatPercentage?: number;
  goalSetting: string;
  selfRatedSkills: object;
  mentalReadinessScore: number;
  motivationalDrivers: string;
  weaknesses: string;
  createdAt: Date;
}

const PreSeasonSchema = new Schema<IPreSeason>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    season: { type: String, required: true },
    aerobicEnduranceTest: { type: Object, required: true },
    speedAgilityTest: { type: Object, required: true },
    strengthTest: { type: Object, required: true },
    flexibilityMobility: { type: String, required: true },
    bodyFatPercentage: { type: Number },
    goalSetting: { type: String, required: true },
    selfRatedSkills: { type: Object, required: true },
    mentalReadinessScore: { type: Number, required: true },
    motivationalDrivers: { type: String, required: true },
    weaknesses: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IPreSeason>("PreSeason", PreSeasonSchema);
