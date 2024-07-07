const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const { facebookLoginService } = require('./auth.service');

const router = require('express').Router(); // Aquí se utiliza require('express').Router() para obtener el router de Express

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:4000/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const token = await facebookLoginService(profile);
        return done(null, { token });
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.token); // Serializa el token en lugar de user.id si es un token JWT
});

passport.deserializeUser(async (token, done) => {
    try {
        done(null, { token }); // Deserializa el token
    } catch (err) {
        done(err, null);
    }
});

router.get('/',
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        // Redirige con el token como query parameter a la URL del cliente
        res.redirect(`http://localhost:3000/home?token=${req.user.token}`);
    }
);

module.exports = router;
