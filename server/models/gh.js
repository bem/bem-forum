const url = require('url');
const got = require('gh-got');
const config = require('../config');
const logger = require('../logger');

const moment = require('moment');
const marked = require('marked');

const requestUrl = [config.ghAPI, 'repos', config.org, config.repo].join('/');
const issuesRequestUrl = [requestUrl, 'issues'].join('/');
const labelsRequestUrl = [requestUrl, 'labels'].join('/');

function createIssue(commentData, token) {
    return got.post(issuesRequestUrl, {
        body: {
            title: commentData.title,
            body: commentData.body
        },
        token
    });
}

function getIssues(token, query) {
    return makeIssueRequest(null, { query, token });
}

function getIssue(id, token, query) {
    return makeIssueRequest(id, { query, token });
}

function updateComment(reqId, data, token) {
    return got.patch(`${issuesRequestUrl}/comments/${reqId}`, {
        body: data,
        token
    });
}

function updateIssue(reqId, data, token) {
    return got.patch(`${issuesRequestUrl}/${reqId}`, {
        body: data,
        token
    });
}

function getComment(commentId, opts) {
    return got(`${issuesRequestUrl}/comments/${commentId}`, Object.assign(
        opts,
        { query: Object.assign({ state: 'all' }, opts.query) }
    )).then(data => data.body);
}

function addComment(issueId, text, token) {
    return got.post(`${issuesRequestUrl}/${issueId}/comments`, {
        body: { body: text },
        token
    });
}

function deleteComment(commentId, token) {
    return got.delete(`${issuesRequestUrl}/comments/${commentId}`, { token });
}

function getIssueComments(issueId, opts) {
    const commentsRequestUrl = `${issuesRequestUrl}/${issueId}/comments`;

    return got(`${commentsRequestUrl}`, opts)
        .then(commentsResponse => (commentsResponse.body.map(comment => {
            comment.created_from_now = moment(comment.created_at).fromNow();
            comment.html = marked(comment.body);

            return comment;
        })));
}

function makeIssueRequest(issueId, opts) {
    const issueRequestUrl = issueId ? `${issuesRequestUrl}/${issueId}` : issuesRequestUrl;

    logger.log('API request to', issueRequestUrl);

    return got(issueRequestUrl, Object.assign(
        opts,
        { query: Object.assign({ state: 'all' }, opts.query) }
    )).then(data => {
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

function getLabels(opts) {
    return got(labelsRequestUrl, opts)
        .then(labels => labels.body);
}

module.exports = {
    createIssue,
    updateIssue,
    getIssues,
    getIssue,
    getComment,
    addComment,
    getIssueComments,
    deleteComment,
    updateComment,
    getLabels,
    makeIssueRequest
};
