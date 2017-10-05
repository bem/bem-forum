const express = require('express');
const router = express.Router();

const config = require('./config');
const render = require('./render').render;
const controllers = require('./controllers');
const passportGitHub = require('./auth');

const isDev = process.env.NODE_ENV === 'development';
const checkAuth = (req, res, next) => req.user ? next() : res.redirect(config.pathPrefix + '/error');
const keepRetpath = (req, res, next) => {
    req.session.retpath = req.path;
    return next();
};

router
    .get('/ping/', (req, res) => res.send('ok'))
    .get('/', keepRetpath, controllers.gh.getIndex)

    // Issue routes
    .get('/create', checkAuth, keepRetpath, controllers.gh.createIssuePage)
    .get('/:id(\\d+)', keepRetpath, controllers.gh.getComplexIssue)
    .get('/api/form/:id(\\d+)', keepRetpath, controllers.gh.getIssue)
    .patch('/api/:id(\\d+)', checkAuth, controllers.gh.updateIssue)
    .patch('/api/issues/comments/:id(\\d+)', checkAuth, controllers.gh.updateComment)
    .delete('/api/issues/comments/:id(\\d+)', checkAuth, controllers.gh.deleteComment)

    .get('/api/issues', keepRetpath, controllers.gh.getIssues)
    .get('/api/:id(\\d+)/comments', controllers.gh.getComments)
    .get('/api/issues/comments/:id(\\d+)', controllers.gh.getComment)
    .post('/api/:id(\\d+)/comments', checkAuth, controllers.gh.addComment)
    .post('/api/create', checkAuth, controllers.gh.createIssue)

    // Auth routes
    .get('/auth/github', passportGitHub.authenticate('github', { scope: ['public_repo'] }))
    .get('/login_callback',
        passportGitHub.authenticate('github', { failureRedirect: config.pathPrefix + '/error' }),
        function(req, res) {
            res.redirect(req.session.retpath || config.pathPrefix + '/');
        }
    )
    .get('/logout', (req, res) => {
        req.logout();
        res.redirect(config.pathPrefix + '/');
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
