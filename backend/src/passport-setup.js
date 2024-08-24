import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; // Correct import statement

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/user/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Handle user profile and authentication here
    return done(null, profile);
  }
));
