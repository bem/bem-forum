var passport = require('passport'),
    GitHubStrategy = require('passport-github2').Strategy,
    env = process.env,
    config;

try {
    config = require('./secret-config').github;

    Array.isArray(config) || (config = [config]);
} catch (err) {
    //
}

var secretIndex = Math.ceil(Math.random() * config.length - 1);
var clientID = env.BEM_FORUM_CLIENT_ID || config[secretIndex].clientID,
    clientSecret = env.BEM_FORUM_CLIENT_SECRET || config[secretIndex].clientSecret;

function verify(req, accessToken, refreshToken, profile, done) {
    profile = JSON.parse(profile._raw);

    return done(null, {
        id: profile.id,
        avatar: profile.avatar_url,
        login: profile.login,
        accessToken: accessToken
    });
}

module.exports = passport;

// serialize user into the session
passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
    done(null, JSON.parse(user));
});

if (!clientID || !clientSecret) {
    console.error('Please provide clientID and clientSecret');
    return;
}

passport.use(new GitHubStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
}, verify));
