import { Schema, model } from 'mongoose';
const workoutSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: {
        type: String,
        enum: ['cardio', 'strength', 'mobility', 'hiit'],
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'hard'],
        required: true,
    },
    estimatedMinutes: { type: Number, required: true, min: 10 },
    targetMuscles: { type: [String], default: [] },
    scheduledFor: { type: Date, required: true },
    completed: { type: Boolean, default: false },
}, { timestamps: true });
const Workout = model('Workout', workoutSchema);
export default Workout;
