import mongoose, { Schema, Document } from "mongoose";

interface IMatch_performance extends Document {
  playerId: mongoose.Schema.Types.ObjectId;
  season: string;
  matchNumber: number;
  minutesPlayed: number;
  disposals: number;
  effectiveDisposalsPercentage: number;
  tackles: number;
  marks: object;
  clearances: number;
  inside50Entries: number;
  shotsOnGoal: object;
  distanceCovered: number;
  sprintsCount: number;
  heartRateZones: object;
  createdAt:Date;
}
const matchperformanceSchema = new Schema<IMatch_performance>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    season: { type: String, required: true },
    matchNumber:{ type: Number, required: true},
    minutesPlayed: {type: Number,required:true},
    disposals: {type:Number,required:true},
    effectiveDisposalsPercentage: {type: Number,required:true},
    tackles: {type:Number,required:true},
    marks: {type:Object, required:true},
    clearances:{ type: Number, required: true}, 
    inside50Entries: { type: Number, required: true},
    shotsOnGoal:  {type:Object, required:true},
    distanceCovered:  { type: Number, required: true},
    sprintsCount: { type: Number, required: true},
    heartRateZones:  {type:Object, required:true},
    createdAt:{ type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IMatch_performance>("matchperformance", matchperformanceSchema);
