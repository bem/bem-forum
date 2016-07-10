var got = require('got'),
    config = require('../config'),
    logger = require('../logger'),

    moment = require('moment'),
    marked = require('marked'),

    Render = require('../render'),
    render = Render.render;


function onError(req, res, err) {
    logger.error(err);
    res.status(500);
    render(req, res, { data: '500' });
}

function getIssues(req, res) {
    var issuesRequestUrl = [
        config.ghAPI,
        'repos',
        config.org,
        config.repo,
        'issues'
    ].join('/');

    logger.log('getIssues');

    makeIssueRequest(issuesRequestUrl).then(function(issues) {
        const passport = req.session.passport;
        const user = passport && passport.user && JSON.parse(passport.user);

        res.send(render(req, res, {
            user: user,
            issues: issues
        }));
    }).catch(function(err) {
        onError(req, res, err);
    })
}

function getIssue(req, res) {
    var issuesRequestUrl = [
        config.ghAPI,
        'repos',
        config.org,
        config.repo,
        'issues',
        req.params.id
    ].join('/');

    logger.log('getIssue', req.params.id);

    Promise.all([
        makeIssueRequest(issuesRequestUrl),
        makeCommentsRequest(issuesRequestUrl)
    ]).then(function(responses) {
        var issues = responses[0],
            comments = responses[1],
            user = req.session.passport && req.session.passport.user &&  JSON.parse(req.session.passport.user);

        res.send(render(req, res, {
            user: user,
            issues: issues,
            comments: comments
        }));
    }).catch(function(err) {
        onError(req, res, err);
    });
}

function getComments(req, res) {
    var issuesRequestUrl = [
        config.ghAPI,
        'repos',
        config.org,
        config.repo,
        'issues',
        req.params.id
    ].join('/');

    makeCommentsRequest(issuesRequestUrl).then(function(comments) {
        res.send(render(req, res, {
            comments: comments
        }, {
            block: 'comments'
        }))
    });
}

function makeCommentsRequest(issuesRequestUrl) {
    return got(issuesRequestUrl + '/comments')
        .then(function(commentsResponse) {
            return JSON.parse(commentsResponse.body)
                .map(function(comment) {
                    comment.created_from_now = moment(comment.created_at).fromNow();
                    comment.html = marked(comment.body);
                    return comment;
                });
        });
}

function makeIssueRequest(issuesRequestUrl) {

    logger.log('API request to', issuesRequestUrl);

    return got(issuesRequestUrl)
        .then(function(data) {
            return [].concat(JSON.parse(data.body))
                .filter(function(issue) {
                    return !issue.pull_request;
                })
                .map(function(issue) {
                    issue.created_from_now = moment(issue.created_at).fromNow();
                    issue.html = marked(issue.body);
                    return issue;
                });
        });
}

module.exports = {
    getIssues,
    getIssue,
    getComments
};
