var got = require('got'),
    config = require('../config'),
    logger = require('../logger'),

    moment = require('moment'),
    marked = require('marked'),

    Render = require('../render'),
    render = Render.render,
    issuesRequestUrl = [config.ghAPI, 'repos', config.org, config.repo, 'issues'].join('/');

function onError(req, res, err) {
    logger.error(err);
    res.status(500);
    render(req, res, { data: '500' });
}

function getIssues(req, res) {
    logger.log('getIssues');

    makeIssueRequest(issuesRequestUrl).then(function(issues) {
        render(req, res, {
            issues: issues
        });
    }).catch(function(err) {
        onError(req, res, err);
    })
}

function getIssue(req, res) {
    _getIssueBody(req, res);
}

function _getIssueBody (req, res, context) {
    var issueRequestUrl = issuesRequestUrl + '/' + req.params.id;
    logger.log('getIssue', req.params.id);

    Promise.all([
        makeIssueRequest(issueRequestUrl),
        makeCommentsRequest(issueRequestUrl)
    ]).then(function(responses) {
        var issues = responses[0],
            comments = responses[1];

        render(req, res, {
            issues: issues,
            comments: comments
        }, context);
    }).catch(function(err) {
        onError(req, res, err);
    });
}

function setIssueState(req, res) {
    /**
     * call from /api/set_issue_state/:id(\\d+)/:state((closed|open))     *
     */
    var requestUrl = issuesRequestUrl + '/' + req.params.id;

    logger.log('Issue #' + req.params.id + ' must be ' + req.params.state);

    makeChangeIssueStateRequest(requestUrl, req.user.token, req.params.state)
        .then(function (newState) {
            logger.log('Issue state has been changed to ' + newState);
            
            //Return HTML of page part
            _getIssueBody(req, res, {block: 'issues'});
        })
        .catch(function(err) {
            logger.error(err);

            //Use commented line, if you want to throw error with real reason 
            // to client-side:
            
            //res.status(500).send(err.toString());
            onError(req, res, err);
        });
}

function getComments(req, res) {
    var issueRequestUrl = issuesRequestUrl + '/' + req.params.id;

    makeCommentsRequest(issueRequestUrl).then(function(comments) {
        render(req, res, {
            comments: comments
        }, {
            block: 'comments'
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

function makeChangeIssueStateRequest(issueRequestUrl, token, state) {
    /**
     * @param issueRequestUrl {String} required, url for API knocking
     * @param token {String} required, token, generated in Passport to allow user change data
     * @param state {String} default: 'closed', possible values 'closed' or 'open'
     * 
     * @return {Promise} resolve - new state of issue, reject - same error
     */
    
    logger.log('API request to', issueRequestUrl);

    var possibleStates = ['closed', 'open'];
    state = state || 'closed';

    if (typeof issueRequestUrl !== 'string' || typeof token !== 'string') {
        return new Promise (function (res, rej) {
            rej(new Error('Not enough required arguments'));
        });
    }

    if (possibleStates.indexOf(state) === -1) {
        return new Promise(function (res, rej) {
            rej(new Error('Identifier "state" must be a string with value "closed" or "open"'));
        });
    }

    return got(issueRequestUrl, {
        method: 'PATCH',
        json: true,
        headers: {
            'user-agent': 'bem-forum',
            accept: 'application/vnd.github.v3.full+json',
            authorization: 'token ' + token
        },
        body: JSON.stringify({
            state: state
        })
    }).then(
        function (response) {
            return response.body.state;
        },
        function (err) {
            throw new Error(err.response.statusCode + ': ' + err.response.body.message);
        }
    );
}

module.exports = {
    getIssues,
    getIssue,
    getComments,
    setIssueState
};
