const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const githubConfig = require('./config').github;
const env = process.env;

const clientID = env.BEM_FORUM_CLIENT_ID || githubConfig.clientID;
const clientSecret = env.BEM_FORUM_CLIENT_SECRET || githubConfig.clientSecret;

function verify(req, accessToken, refreshToken, profile, done) {
    profile = JSON.parse(profile._raw);

    return done(null, {
        id: profile.id,
        avatar: profile.avatar_url,
        login: profile.login,
        accessToken
    });
}

// serialize user into the session
passport.serializeUser((user, done) => {
    done(null, JSON.stringify(user));
});

passport.deserializeUser((user, done) => {
    done(null, JSON.parse(user));
});

if (!clientID || !clientSecret) {
    console.error('Please provide clientID and clientSecret');
    return;
}

passport.use(new GitHubStrategy({
    clientID,
    clientSecret,
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
}, verify));

module.exports = passport;
