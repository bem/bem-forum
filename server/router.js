var express = require('express'),
    router = express.Router(),

    render = require('./render').render,
    controllers = require('./controllers'),
    passportGitHub = require('./auth');

// Login routes
router
    .get('/auth/github', passportGitHub.authenticate('github', { scope: ['user:email'] }))

    .get('/auth/github/callback', passportGitHub.authenticate('github', { failureRedirect: '/error' }), (req, res) => {
        res.redirect(req.session.retpath || '/')
    })
    .get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

router
    .get('/ping/', function(req, res) {
        res.send('ok');
    })
    .get('/', keepRetpath, controllers.gh.getIssues)

    // TODO: number
    .get('/:id', keepRetpath, controllers.gh.getIssue)

    .get('/api/:id/comments', controllers.gh.getComments)

    .get('/error', function(req, res) {
        res.status(401);
        return render(req, res, { view: '401' });
    })
    .get('*', function(req, res) {
        res.status(404);
        return render(req, res, { view: '404' });
    });

function keepRetpath(req, res, next) {
    req.session.retpath = req.path;
    return next();
}

module.exports = router;
