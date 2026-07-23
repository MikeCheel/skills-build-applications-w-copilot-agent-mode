import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    age: { type: Number, min: 13, max: 100 },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    weeklyGoalMinutes: { type: Number, required: true, min: 30 },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true },
);

const User = model('User', userSchema);

export default User;
