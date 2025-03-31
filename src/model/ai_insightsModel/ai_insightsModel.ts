import mongoose, { Schema, Document } from "mongoose";

interface IAiinsight extends Document {
  playerId: mongoose.Schema.Types.ObjectId;
  season: string;
  insights: object[];
  trainingAdjustments:object;
  createdAt: Date;
}

const AiSchema = new Schema<IAiinsight>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    season: { type: String, required: true },
    insights:{type: [Object],required:true},
    trainingAdjustments:{type:Object, required:true},
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IAiinsight>("Aiinsight", AiSchema);
