import { Router } from 'express';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
const apiRouter = Router();
apiRouter.get('/users', async (_req, res) => {
    const data = await User.find().populate('team', 'name city points').lean();
    res.status(200).json({ resource: 'users', count: data.length, data });
});
apiRouter.get('/teams', async (_req, res) => {
    const data = await Team.find()
        .populate('captain', 'fullName email')
        .populate('members', 'fullName email fitnessLevel')
        .lean();
    res.status(200).json({ resource: 'teams', count: data.length, data });
});
apiRouter.get('/activities', async (_req, res) => {
    const data = await Activity.find()
        .sort({ performedAt: -1 })
        .populate('user', 'fullName email')
        .lean();
    res.status(200).json({ resource: 'activities', count: data.length, data });
});
apiRouter.get('/leaderboard', async (_req, res) => {
    const data = await Leaderboard.find()
        .populate('entries.user', 'fullName')
        .populate('entries.team', 'name')
        .lean();
    res.status(200).json({ resource: 'leaderboard', count: data.length, data });
});
apiRouter.get('/workouts', async (_req, res) => {
    const data = await Workout.find()
        .sort({ scheduledFor: 1 })
        .populate('user', 'fullName fitnessLevel')
        .lean();
    res.status(200).json({ resource: 'workouts', count: data.length, data });
});
export default apiRouter;
