var got = require('got'),
    config = require('../config'),
    logger = require('../logger'),

    moment = require('moment'),
    marked = require('marked'),

    Render = require('../render'),
    render = Render.render,
    dropCache = Render.dropCache, // eslint-disable-line no-unused-vars
    issuesRequestUrl = [config.ghAPI, 'repos', config.org, config.repo, 'issues'].join('/');

function onError(req, res, err) {
    logger.error(err);
    res.status(500);
    render(req, res, { view: '500' });
}

function getIssues(req, res) {
    logger.log('getIssues');

    makeIssueRequest(issuesRequestUrl).then(function(issues) {
        render(req, res, {
            view: 'page-index',
            issues: issues
        });
    }).catch(function(err) {
        onError(req, res, err);
    })
}

function getIssue(req, res) {
    var issueRequestUrl = issuesRequestUrl + '/' + req.params.id;

    logger.log('getIssue', req.params.id);

    Promise.all([
        makeIssueRequest(issueRequestUrl),
        makeCommentsRequest(issueRequestUrl)
    ]).then(function(responses) {
        var issues = responses[0],
            comments = responses[1];

        render(req, res, {
            view: 'page-index',
            issues: issues,
            comments: comments
        });
    }).catch(function(err) {
        onError(req, res, err);
    });
}

function getComments(req, res) {
    var issueRequestUrl = issuesRequestUrl + '/' + req.params.id;

    makeCommentsRequest(issueRequestUrl).then(function(comments) {
        render(req, res, {
            view: 'page-index',
            comments: comments
        }, {
            block: 'comments'
        });
    }).catch(function(err) {
        onError(req, res, err);
    });
}

function getCommentPreview(req, res) {
    var comment = req.body.data;

    res.send(marked(comment));
}

function get404 (req, res) {
    makeIssueRequest(issuesRequestUrl).then(function(issues) {
        var latestIssues = issues.slice(0, 10);

        res.status(404);
        render(req, res, {
            issues: latestIssues,
            view: '404'
        });
    }).catch(function(err) {
        onError(req, res, err);
    });
}

function makeCommentsRequest(issueRequestUrl) {
    return got(issueRequestUrl + '/comments')
        .then(function(commentsResponse) {
            return JSON.parse(commentsResponse.body)
                .map(function(comment) {
                    comment.created_from_now = moment(comment.created_at).fromNow();
                    comment.html = marked(comment.body);
                    return comment;
                });
        });
}

function makeIssueRequest(issueRequestUrl) {
    logger.log('API request to', issueRequestUrl);

    return got(issueRequestUrl)
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
    getComments,
    getCommentPreview,
    get404
};
