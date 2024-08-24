// src/passport-setup.js or your main setup file

import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from './models/User'; // Adjust the path based on your project structure

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/v1/user/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  // Check if user already exists in our db
  const existingUser = await User.findOne({ googleId: profile.id });
  if (existingUser) {
    // Already have this user
    return done(null, existingUser);
  }
  // If not, create a new user
  const newUser = await new User({
    googleId: profile.id,
    email: profile.emails[0].value,
    name: profile.displayName
  }).save();
  done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
