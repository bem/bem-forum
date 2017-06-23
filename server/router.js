const express = require('express');
const router = express.Router();

const render = require('./render').render;
const controllers = require('./controllers');
const passportGitHub = require('./auth');

const isDev = process.env.NODE_ENV === 'development';
const checkAuth = (req, res, next) => req.user ? next() : res.redirect('/error');
const keepRetpath = (req, res, next) => {
    req.session.retpath = req.path;
    return next();
};

router
    .get('/ping/', (req, res) => res.send('ok'))
    .get('/', keepRetpath, controllers.gh.getIssues)

    // Issue routes
    .get('/create', checkAuth, keepRetpath, controllers.gh.createIssuePage)
    .get('/:id(\\d+)', keepRetpath, controllers.gh.getIssue)
    .patch('/api/:id(\\d+)', checkAuth, controllers.gh.updateIssue)

    .get('/api/:id(\\d+)/comments', controllers.gh.getComments)
    .post('/api/:id(\\d+)/comments', checkAuth, controllers.gh.addComment)
    .post('/api/create', checkAuth, controllers.gh.createIssue)

    // Auth routes
    .get('/auth/github', passportGitHub.authenticate('github', { scope: ['public_repo'] }))
    .get('/auth/github/callback', passportGitHub.authenticate('github', { failureRedirect: '/error' }), function(req, res) {
        res.redirect(req.session.retpath || '/');
    })
    .get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
    .get('/error', (req, res) => {
        res.status(401);
        render(req, res, { view: '401' });
    });

if (isDev) {
    router.get('/err/', () => {
        throw new Error('Uncaught exception from /error');
    });

    router.use(require('errorhandler')());
}

module.exports = router;
