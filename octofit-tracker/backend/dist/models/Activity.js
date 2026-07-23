import { Schema, model } from 'mongoose';
const activitySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['run', 'ride', 'strength', 'yoga', 'swim', 'walk'],
        required: true,
    },
    durationMinutes: { type: Number, required: true, min: 5 },
    caloriesBurned: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    performedAt: { type: Date, required: true },
}, { timestamps: true });
const Activity = model('Activity', activitySchema);
export default Activity;
