var express = require('express'),
    router = express.Router(),

    render = require('./render').render,
    controllers = require('./controllers'),
    passportGitHub = require('./auth'),

    isDev = process.env.NODE_ENV === 'development';

router
    .get('/ping/', function(req, res) {
        res.send('ok');
    })
    .get('/', keepRetpath, controllers.gh.getIssues)

    // Issue routes
    .get('/create', keepRetpath, controllers.gh.createIssuePage)
    .get('/:id(\\d+)', keepRetpath, controllers.gh.getIssue)
    .patch('/api/:id(\\d+)', controllers.gh.updateIssue)

    .get('/api/:id(\\d+)/comments', controllers.gh.getComments)
    .post('/api/:id(\\d+)/comments', controllers.gh.addComment)
    .post('/api/create', controllers.gh.createIssue)

    // comments
    .get('/api/comments/:commentId(\\d+)', controllers.gh.renderComment)

    // Auth routes
    .get('/auth/github', passportGitHub.authenticate('github', { scope: ['public_repo'] }))
    .get('/auth/github/callback', passportGitHub.authenticate('github', { failureRedirect: '/error' }), function(req, res) {
        res.redirect(req.session.retpath || '/');
    })
    .get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    })
    .get('/error', function(req, res) {
        // stub for unauthorized redirect
        res.status(401);
        return render(req, res, { view: '401' });
    });

if (isDev) {
    router.get('/err/', function() {
        throw new Error('Uncaught exception from /error');
    });

    router.use(require('errorhandler')());
}

function keepRetpath(req, res, next) {
    req.session.retpath = req.path;
    return next();
}

module.exports = router;
