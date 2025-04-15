import mongoose, { Schema, Document } from 'mongoose';

export interface IOffSeasonPlan extends Document {
  userId: mongoose.Types.ObjectId;
  season: 'off-season';
  startDate: Date;
  endDate: Date;
  trainingDays: number;
  goals: string;
  strengthPercentage: number;
  skillDevPercentage: number;
  conditioningPercentage: number;
  checklist: {
    fitnessAssessment: boolean;
    strengthProgram: boolean;
    skillDevPlan: boolean;
    nutritionPlan: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OffSeasonPlanSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    season: { type: String, default: 'off-season' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    trainingDays: { type: Number, default: 0 },
    goals: { type: String, required: true },

    strengthPercentage: { type: Number, default: 0 },
    skillDevPercentage: { type: Number, default: 0 },
    conditioningPercentage: { type: Number, default: 0 },

    checklist: {
      fitnessAssessment: { type: Boolean, default: false },
      strengthProgram: { type: Boolean, default: false },
      skillDevPlan: { type: Boolean, default: false },
      nutritionPlan: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.models.OffSeasonPlan ||
  mongoose.model<IOffSeasonPlan>('OffSeasonPlan', OffSeasonPlanSchema);
