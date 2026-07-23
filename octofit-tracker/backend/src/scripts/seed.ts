import { connectDatabase, disconnectDatabase } from '../config/database.js';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();
    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        fullName: 'Ava Thompson',
        email: 'ava.thompson@octofit.dev',
        age: 28,
        fitnessLevel: 'advanced',
        weeklyGoalMinutes: 300,
      },
      {
        fullName: 'Noah Ramirez',
        email: 'noah.ramirez@octofit.dev',
        age: 34,
        fitnessLevel: 'intermediate',
        weeklyGoalMinutes: 240,
      },
      {
        fullName: 'Mia Chen',
        email: 'mia.chen@octofit.dev',
        age: 26,
        fitnessLevel: 'intermediate',
        weeklyGoalMinutes: 210,
      },
      {
        fullName: 'Liam Patel',
        email: 'liam.patel@octofit.dev',
        age: 31,
        fitnessLevel: 'beginner',
        weeklyGoalMinutes: 150,
      },
    ]);

    const teams = await Team.insertMany([
      {
        name: 'Peak Pulse',
        city: 'Seattle',
        points: 915,
        captain: users[0]._id,
        members: [users[0]._id, users[2]._id],
      },
      {
        name: 'Stride Collective',
        city: 'Austin',
        points: 860,
        captain: users[1]._id,
        members: [users[1]._id, users[3]._id],
      },
    ]);

    await User.updateMany({ _id: { $in: [users[0]._id, users[2]._id] } }, { team: teams[0]._id });
    await User.updateMany({ _id: { $in: [users[1]._id, users[3]._id] } }, { team: teams[1]._id });

    await Activity.insertMany([
      {
        user: users[0]._id,
        type: 'run',
        durationMinutes: 52,
        caloriesBurned: 540,
        distanceKm: 9.1,
        performedAt: new Date('2026-07-19T07:20:00Z'),
      },
      {
        user: users[1]._id,
        type: 'ride',
        durationMinutes: 68,
        caloriesBurned: 620,
        distanceKm: 24.7,
        performedAt: new Date('2026-07-20T13:10:00Z'),
      },
      {
        user: users[2]._id,
        type: 'strength',
        durationMinutes: 45,
        caloriesBurned: 390,
        performedAt: new Date('2026-07-21T18:30:00Z'),
      },
      {
        user: users[3]._id,
        type: 'walk',
        durationMinutes: 40,
        caloriesBurned: 210,
        distanceKm: 4.5,
        performedAt: new Date('2026-07-22T06:45:00Z'),
      },
      {
        user: users[0]._id,
        type: 'yoga',
        durationMinutes: 35,
        caloriesBurned: 160,
        performedAt: new Date('2026-07-22T19:00:00Z'),
      },
    ]);

    await Workout.insertMany([
      {
        user: users[0]._id,
        title: 'Tempo Run + Core Finisher',
        category: 'cardio',
        difficulty: 'hard',
        estimatedMinutes: 55,
        targetMuscles: ['quads', 'glutes', 'core'],
        scheduledFor: new Date('2026-07-24T07:00:00Z'),
        completed: false,
      },
      {
        user: users[1]._id,
        title: 'Endurance Cycling Session',
        category: 'cardio',
        difficulty: 'moderate',
        estimatedMinutes: 70,
        targetMuscles: ['hamstrings', 'calves'],
        scheduledFor: new Date('2026-07-24T12:30:00Z'),
        completed: false,
      },
      {
        user: users[2]._id,
        title: 'Upper Body Strength Builder',
        category: 'strength',
        difficulty: 'moderate',
        estimatedMinutes: 50,
        targetMuscles: ['chest', 'back', 'shoulders'],
        scheduledFor: new Date('2026-07-24T17:45:00Z'),
        completed: false,
      },
      {
        user: users[3]._id,
        title: 'Mobility + Recovery Flow',
        category: 'mobility',
        difficulty: 'easy',
        estimatedMinutes: 30,
        targetMuscles: ['hips', 'hamstrings', 'lower back'],
        scheduledFor: new Date('2026-07-24T19:15:00Z'),
        completed: true,
      },
    ]);

    await Leaderboard.insertMany([
      {
        period: 'weekly',
        startDate: new Date('2026-07-20T00:00:00Z'),
        endDate: new Date('2026-07-26T23:59:59Z'),
        entries: [
          { rank: 1, points: 480, user: users[0]._id, team: teams[0]._id },
          { rank: 2, points: 445, user: users[1]._id, team: teams[1]._id },
          { rank: 3, points: 390, user: users[2]._id, team: teams[0]._id },
          { rank: 4, points: 330, user: users[3]._id, team: teams[1]._id },
        ],
      },
    ]);

    console.log('Database seeding complete');
    console.log(
      `Inserted ${users.length} users, ${teams.length} teams, 5 activities, 4 workouts, and 1 leaderboard.`,
    );
    await disconnectDatabase();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
