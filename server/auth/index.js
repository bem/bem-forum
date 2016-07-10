const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const config = require('../../config');

passport.use(new GitHubStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret ,
        callbackURL: '/auth/github/callback',
        passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
        profile = JSON.parse(profile._raw);

        return done(null, {
            avatar: profile.avatar_url,
            login: profile.login
        });
    }));

// serialize user into the session
passport.serializeUser((user, done) => {
    done(null, JSON.stringify(user));
});

passport.deserializeUser((user, done) => {
    done(null, JSON.parse(user));
});

module.exports = passport;
