const express = require('express');
const router = express.Router();

const config = require('./config');
const render = require('./render').render;
const controllers = require('./controllers');
const passportGitHub = require('./auth');

const isDev = process.env.NODE_ENV === 'development';
const checkAuth = (req, res, next) => req.user ? next() : res.redirect(config.pathPrefix + '/error');
const keepRetpath = (req, res, next) => {
    req.session.retpath = config.pathPrefix + req.path;

    return next();
};

router
    .get('/ping/', (req, res) => res.send('ok'))
    .get('/', keepRetpath, controllers.forum.getIndex)

    // Issue routes
    .get('/create', checkAuth, keepRetpath, controllers.forum.createIssuePage)
    .get('/:id(-?\\d+)', keepRetpath, controllers.forum.getComplexIssue)
    .get('/api/form/:id(-?\\d+)', keepRetpath, controllers.forum.getIssue)
    .patch('/api/:id(\\d+)', checkAuth, controllers.forum.updateIssue)
    .patch('/api/issues/comments/:id(\\d+)', checkAuth, controllers.forum.updateComment)
    .delete('/api/issues/comments/:id(\\d+)', checkAuth, controllers.forum.deleteComment)

    .get('/api/issues', keepRetpath, controllers.forum.getIssues)
    .get('/api/:id(-?\\d+)/comments', controllers.forum.getComments)
    .get('/api/issues/comments/:id(-?\\d+)', controllers.forum.getComment)
    .post('/api/:id(\\d+)/comments', checkAuth, controllers.forum.addComment)
    .post('/api/create', checkAuth, controllers.forum.createIssue)

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
