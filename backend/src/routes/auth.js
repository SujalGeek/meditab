import express from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/v1/user/auth/google/callback'
  },
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));


// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('http://localhost:5173/');
  }
);

export default router;
