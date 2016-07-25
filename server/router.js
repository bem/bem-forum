var express = require('express'),
    router = express.Router(),

    render = require('./render').render,
    controllers = require('./controllers'),
    passportGitHub = require('./auth'),

    config = require('./config.js');

router
    .get('/ping/', function(req, res) {
        res.send('ok');
    })
    .get('/', keepRetpath, controllers.gh.getIssues)

    .get('/:id(\\d+)', keepRetpath, controllers.gh.getIssue)

    .get('/api/:id(\\d+)/comments', controllers.gh.getComments)

    .get('/api/set_issue_state/:id(\\d+)/:state((closed|open))', controllers.gh.setIssueState)    

    // Auth routes
    .get('/auth/github', passportGitHub.authenticate('github', { scope: config.userRights.usual }))
    .get('/auth/github/callback', passportGitHub.authenticate('github', { failureRedirect: '/error' }), function(req, res) {
        res.redirect(req.session.retpath || '/');
    })
    .get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    })
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
