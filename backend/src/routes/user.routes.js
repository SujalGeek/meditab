import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get("/auth/google/callback", 
    passport.authenticate("google", { 
        failureRedirect: "/login" 
    }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
);

export default router;
