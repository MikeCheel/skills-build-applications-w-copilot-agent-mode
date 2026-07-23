import { Schema, model } from 'mongoose';

const leaderboardEntrySchema = new Schema(
  {
    rank: { type: Number, required: true, min: 1 },
    points: { type: Number, required: true, min: 0 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  },
  { _id: false },
);

const leaderboardSchema = new Schema(
  {
    period: {
      type: String,
      enum: ['weekly', 'monthly'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    entries: { type: [leaderboardEntrySchema], default: [] },
  },
  { timestamps: true },
);

const Leaderboard = model('Leaderboard', leaderboardSchema);

export default Leaderboard;
