import mongoose from 'mongoose';

const PreSeasonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  fitnessScore: {
    type: Number,
    required: true,
    default: 0,
  },
  cognitiveReadiness: {
    type: Number,
    required: true,
    default: 0,
  },
  baselineData: {
    type: Number,
    required: true,
    default: 0,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: () => new Date(new Date().setMonth(new Date().getMonth() + 3)),
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.models.PreSeason || mongoose.model('PreSeason', PreSeasonSchema);
 