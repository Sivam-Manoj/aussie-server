import mongoose, { Schema, Document } from "mongoose";

interface WeeklyStat {
  distanceCovered: number;
  sprints: number;
  tackles: number;
  possessions: number;
}

interface PerformanceMetric {
  matchPerformance: number;
  trainingAttendance: number;
  tacticalUnderstanding: number;
}

export interface IInSeason extends Document {
  playerId: mongoose.Schema.Types.ObjectId;
  season: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  performanceMetrics: PerformanceMetric;
  weeklyStats: WeeklyStat;
  createdAt: Date;
  updatedAt: Date;
}

const InSeasonSchema = new Schema<IInSeason>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    season: { type: String, required: true }, // Example: "in-season"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    progress: { type: Number, default: 0 }, // Represented in percentage

    performanceMetrics: {
      matchPerformance: { type: Number, default: 0 }, // In %
      trainingAttendance: { type: Number, default: 0 }, // In %
      tacticalUnderstanding: { type: Number, default: 0 }, // In %
    },

    weeklyStats: {
      distanceCovered: { type: Number, default: 0 }, // in km
      sprints: { type: Number, default: 0 },
      tackles: { type: Number, default: 0 },
      possessions: { type: Number, default: 0 },
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IInSeason>("InSeason", InSeasonSchema);
