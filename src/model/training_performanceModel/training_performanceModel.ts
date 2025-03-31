import mongoose, { Schema, Document } from "mongoose";

interface ITraining extends Document {
  playerId: mongoose.Schema.Types.ObjectId;
  season: string;
  week: number;
  trainingAttendance: string;
  sessionType: string;
  trainingIntensity: number;
  focusAreas: string[];
  coachFeedback:string;
  notes:string;
  createdAt: Date;
}

const TrainingSchema = new Schema<ITraining>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    season: { type: String, required: true },
    week:{type: Number,required: true},
    trainingAttendance:{type: String, required:true},
    sessionType:{type: String, required:true},
    trainingIntensity:{type:Number,required: true},
    focusAreas:{type:[String], required:true},
    coachFeedback:{type:String, required:true},
    notes:{type:String, required:true},
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ITraining>("TrainingPerformance", TrainingSchema);
