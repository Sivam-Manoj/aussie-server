import mongoose, { Schema, Document } from "mongoose";

interface IPostSeaon extends Document {
  playerId: mongoose.Schema.Types.ObjectId;
  season: string;
  selfevaluation: number;
  coachFeedbackSummary: string;
  keystreangth:string[];
  areasForImprovement:string[];
  fitnessProgress:string;
  offSeasonPlan:object;
  createdAt: Date;
}

const PostSchema = new Schema<IPostSeaon>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    season: { type: String, required: true },
    selfevaluation:{ type: Number, required:true},
    coachFeedbackSummary: {type: String, required:true},
    keystreangth:{type: [String], required:true},
    areasForImprovement:{type: [String], required:true},
    fitnessProgress:{type: String, required:true},
    offSeasonPlan:{type: Object, required:true},
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IPostSeaon>("PostSeason", PostSchema);
