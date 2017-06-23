const url = require('url');
const got = require('gh-got');
const config = require('../config');
const logger = require('../logger');

const moment = require('moment');
const marked = require('marked');

const Render = require('../render');
const render = Render.render;
const dropCache = Render.dropCache; // eslint-disable-line no-unused-vars
const tokens = config.github.tokens;
const requestUrl = [config.ghAPI, 'repos', config.org, config.repo].join('/');
const issuesRequestUrl = [requestUrl, 'issues'].join('/');
const labelsRequestUrl = [requestUrl, 'labels'].join('/');

const getToken = user => user ? user.accessToken : tokens[Math.ceil(Math.random() * tokens.length - 1)];

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
            title: commentData.title,
            body: commentData.text
        },
        token: getToken(req.user)
    }).then(postData => res.status(200).send(postData.body))
        .catch(err => onError(req, res, err));
}

function getIssues(req, res) {
    logger.log('getIssues');

    const token = getToken(req.user);

    Promise.all([
        makeIssueRequest(issuesRequestUrl, { query: req.query, token }),
        makeLabelsRequest(labelsRequestUrl, { token })
    ]).then(responses => {
        const issuesData = responses[0];
        const labelsData = responses[1];

        render(req, res, {
            view: 'page-index',
            issues: issuesData.issues,
            pagination: issuesData.pagination,
            labels: labelsData
        });
    }).catch(err => onError(req, res, err));
}

function getIssue(req, res) {
    logger.log('getIssue', req.params.id);

    const issueRequestUrl = `${issuesRequestUrl}/${req.params.id}`;
    const token = getToken(req.user);

    Promise.all([
        makeIssueRequest(issueRequestUrl, { token }),
        makeCommentsRequest(issueRequestUrl, { token })
    ]).then(responses => {
        const issue = responses[0].issues[0];
        const comments = responses[1];

        render(req, res, {
            view: 'page-post',
            issue,
            comments
        });
    }).catch(err => onError(req, res, err));
}

function updateIssue(req, res) {
    logger.log('update issue', req.params.id, 'with data', req.body);

    got.patch(`${issuesRequestUrl}/${req.params.id}`, {
        body: req.body,
        token: getToken(req.user)
    }).then(() => res.status(204).send('ok'))
        .catch(error => onError(req, res, error));
}

function getComments(req, res) {
    makeCommentsRequest(`${issuesRequestUrl}/${req.params.id}`, { token: getToken(req.user) })
        .then(comments => render(req, res, {
            view: 'page-post',
            comments: comments,
            issueId: req.params.id
        }, {
            block: 'comments'
        }))
        .catch(err => onError(req, res, err));
}

function addComment(req, res) {
    return got.post(`${issuesRequestUrl}/${req.params.id}/comments`, {
        body: { body: req.body.text },
        token: getToken(req.user)
    }).then(response => res.status(201).json(response.body))
        .catch(error => onError(req, res, error));
}

function get404(req, res) {
    logger.error('404', req.url);

    makeIssueRequest(issuesRequestUrl, { token: getToken(req.user) })
        .then(issuesData => {
            res.status(404);
            render(req, res, {
                issues: issuesData.issues.slice(0, 10), // 10 last issues
                view: '404'
            });
        })
        .catch(err => onError(req, res, err));
}

function makeCommentsRequest(issueRequestUrl, opts) {
    return got(`${issueRequestUrl}/comments`, opts)
        .then(commentsResponse => (commentsResponse.body.map(comment => {
            comment.created_from_now = moment(comment.created_at).fromNow();
            comment.html = marked(comment.body);
            return comment;
        })));
}

function makeIssueRequest(issueRequestUrl, opts) {
    logger.log('API request to', issueRequestUrl);

    return got(issueRequestUrl, {
        query: Object.assign({ state: 'all' }, opts.query)
    }).then(data => {
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
                .filter(issue => !issue.pull_request)
                .map(issue => {
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
