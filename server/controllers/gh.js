var url = require('url'),
    got = require('gh-got'),
    config = require('../config'),
    logger = require('../logger'),

    moment = require('moment'),
    marked = require('marked'),

    Render = require('../render'),
    render = Render.render,
    dropCache = Render.dropCache, // eslint-disable-line no-unused-vars
    requestUrl = [config.ghAPI, 'repos', config.org, config.repo].join('/'),
    issuesRequestUrl = [requestUrl, 'issues'].join('/'),
    labelsRequestUrl = [requestUrl, 'labels'].join('/');

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
        token: req.user && req.user.accessToken
    })
        .then(postData => {
            res.status(200).send(postData.body);
        })
        .catch(err => onError(req, res, err));
}

function getIssues(req, res) {
    logger.log('getIssues');

    const token = req.user && req.user.accessToken;

    Promise.all([
        makeIssueRequest(issuesRequestUrl, { token, query: req.query }),
        makeLabelsRequest(labelsRequestUrl, { token })
    ]).then(function(responses) {
        const issuesData = responses[0];
        const labelsData = responses[1];

        render(req, res, {
            view: 'page-index',
            issues: issuesData.issues,
            pagination: issuesData.pagination,
            labels: labelsData
        });
    }).catch(function(err) {
        onError(req, res, err);
    });
}

function getIssue(req, res) {
    logger.log('getIssue', req.params.id);

    const token = req.user && req.user.accessToken;
    const issueRequestUrl = `${issuesRequestUrl}/${req.params.id}`;

    Promise.all([
        makeIssueRequest(issueRequestUrl, { token }),
        makeCommentsRequest(issueRequestUrl, { token })
    ]).then(function(responses) {
        const issue = responses[0].issues[0];
        const comments = responses[1];

        render(req, res, {
            view: 'page-post',
            issue,
            comments
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
        token: req.user && req.user.accessToken
    }).then(function() {
        res.status(204).send('ok');
    }).catch(function(error) {
        onError(req, res, error);
    });
}

function getComments(req, res) {
    var issueRequestUrl = issuesRequestUrl + '/' + req.params.id;

    makeCommentsRequest(issueRequestUrl, { token: req.user && req.user.accessToken }).then(function(comments) {
        return render(req, res, {
            view: 'page-post',
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
    return got.post(reqUrl, { body: { body: req.body.text }, token: req.user && req.user.accessToken })
        .then(function(response) {
            res.status(201).json(response.body);
        })
        .catch(function(error) {
            onError(req, res, error);
        });
}

function get404(req, res) {
    logger.error('404', req.url);

    makeIssueRequest(issuesRequestUrl, { token: req.user && req.user.accessToken }).then(function(issuesData) {
        var latestIssues = issuesData.issues.slice(0, 10);

        res.status(404);
        render(req, res, {
            issues: latestIssues,
            view: '404'
        });
    }).catch(function(err) {
        onError(req, res, err);
    });
}

function makeCommentsRequest(issueRequestUrl, opts) {
    return got(issueRequestUrl + '/comments', opts)
        .then(function(commentsResponse) {
            return commentsResponse.body
                .map(function(comment) {
                    comment.created_from_now = moment(comment.created_at).fromNow();
                    comment.html = marked(comment.body);
                    return comment;
                });
        });
}

function makeIssueRequest(issueRequestUrl, opts) {
    logger.log('API request to', issueRequestUrl);

    return got(issueRequestUrl, {
        query: Object.assign({ state: 'all' }, opts.query),
        token: opts.token
    })
        .then(function(data) {
            // E.g. '<https://api.github.com/repositories/14397309/issues?state=all&page=2>; rel="next", <https://api.github.com/repositories/14397309/issues?state=all&page=46>; rel="last"'
            const paginationString = data.headers.link || '';

            // E.g. { next: 'url-query-page-value', last: 'some-url-query-page-value', first: 'some-url-query-page-value', prev: 'some-url-query-page-value' }
            const pagination = paginationString.split(', ').reduce((acc, str) => {
                const match = /<(.*?)>; rel="(.*?)"/.exec(str);
                if (match) {
                    acc[match[2]] = '?' + url.parse(match[1]).query;
                }

                return acc;
            }, {});

            return {
                pagination,
                issues: [].concat(data.body)
                    .filter(function(issue) {
                        return !issue.pull_request;
                    })
                    .map(function(issue) {
                        issue.created_from_now = moment(issue.created_at).fromNow();
                        issue.html = marked(issue.body || '');
                        return issue;
                    })
            };
        });
}

function makeLabelsRequest(labelRequestUrl, opts) {
    return got(labelRequestUrl, opts)
        .then(labels => labels.body);
}

module.exports = {
    createIssuePage,
    createIssue,
    updateIssue,
    getIssues,
    getIssue,
    getComments,
    addComment,
    get404
};
