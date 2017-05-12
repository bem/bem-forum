var got = require('gh-got'),
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

function createIssuePage(req, res) {
    logger.log('createIssue page');

    return render(req, res, {
        view: 'page-create-post'
    });
}

function createIssue(req, res) {
    logger.log('createIssue api');
    const commentData = req.body;

    return got.post(issuesRequestUrl, {
        body: {
            body: commentData.text,
            title: commentData.title
        },
        token: req.user.accessToken
    })
        .then(postData => {
            res.status(200).send(postData.body);
        })
        .catch(err => onError(req, res, err));
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
    });
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

function updateIssue(req, res) {
    var reqUrl = issuesRequestUrl + '/' + req.params.id;

    logger.log('update issue', req.params.id, 'with data', req.body);

    got.patch(reqUrl, {
        body: req.body,
        token: req.user.accessToken
    }).then(function() {
        res.status(204).send('ok');
    }).catch(function(error) {
        onError(req, res, error);
    });
}

function getComments(req, res) {
    var issueRequestUrl = issuesRequestUrl + '/' + req.params.id;

    makeCommentsRequest(issueRequestUrl).then(function(comments) {
        return render(req, res, {
            view: 'page-index',
            comments: comments,
            issueId: req.params.id
        }, {
            block: 'comments'
        });
    }).catch(function(err) {
        onError(req, res, err);
    });
}

function addComment(req, res) {
    var reqUrl = `${issuesRequestUrl}/${req.params.id}/comments`;
    return got.post(reqUrl, { body: { body: req.body.text }, token: req.user.accessToken })
        .then(function(response) {
            res.status(201).json(response.body);
        })
        .catch(function(error) {
            onError(req, res, error);
        });
}

// из закрытого issue нельзя доставать один комментарий :-(
function _getComment(req, res, id) {
    const commentId = id || req.params.commentId;

    var reqUrl = `${issuesRequestUrl}/comments/${commentId}`;
    return got(reqUrl);
}

function _formatComment(comment) {
    var result = comment;
    result.created_from_now = moment(comment.created_at).fromNow();
    result.html = marked(comment.body || '');
    return result;
}

function renderComment(req, res) {
    _getComment(req, res, req.params.commentId)
        .then(comment => {
            return render(req, res, {
                comment: _formatComment(comment.body)
            }, {
                block: 'comment'
            });
        })
        .catch(error => onError(req, res, error));
}

function get404(req, res) {
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
            return commentsResponse.body.map(_formatComment);
        });
}

function makeIssueRequest(issueRequestUrl) {
    logger.log('API request to', issueRequestUrl);

    return got(issueRequestUrl, { query: { state: 'all' } })
        .then(function(data) {
            return [].concat(data.body)
                .filter(function(issue) {
                    return !issue.pull_request;
                })
                .map(function(issue) {
                    issue.created_from_now = moment(issue.created_at).fromNow();
                    issue.html = marked(issue.body || '');
                    return issue;
                });
        });
}

module.exports = {
    createIssuePage,
    createIssue,
    updateIssue,
    getIssues,
    getIssue,
    getComments,
    renderComment,
    addComment,
    get404
};
