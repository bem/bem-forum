var express = require('express'),
    router = express.Router(),

    render = require('./render').render,
    controllers = require('./controllers');

router
    .get('/ping/', function(req, res) {
        res.send('ok');
    })
    .get('/', controllers.gh.getIssues)

    // TODO: number
    .get('/:id', controllers.gh.getIssue)

    .get('/api/:id/comments', controllers.gh.getComments)

    .get('*', function(req, res) {
        res.status(404);
        return render(req, res, { view: '404' });
    });

module.exports = router;
