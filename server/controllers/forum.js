const config = require('../config');
const logger = require('../logger');
const gh = require('../models/gh');
const archive = require('../models/archive');

const Render = require('../render');
const render = Render.render;
const dropCache = Render.dropCache; // eslint-disable-line no-unused-vars
const tokens = config.github.tokens || [];

const getToken = user => user ? user.accessToken : tokens[Math.ceil(Math.random() * tokens.length - 1)];

function onError(req, res, err) {
    logger.error(err);
    if (err.statusCode === 404) return get404(req, res);

    res.status(500);

    return render(req, res, { view: '500' });
}

function createIssuePage(req, res) {
    logger.log('createIssue page');

    return render(req, res, {
        view: 'page-create-post'
    });
}

function createIssue(req, res) {
    logger.log('createIssue api');

    return gh.createIssue(req.body, getToken(req.user))
        .then(postData => res.status(200).send(postData.body))
        .catch(err => onError(req, res, err));
}

function getIndex(req, res) {
    logger.log('getIndex');

    const token = getToken(req.user);

    Promise.all([
        gh.getIssues(token, req.query),
        gh.getLabels({ token })
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

function getIssues(req, res) {
    logger.log('getIssues');

    return gh.getIssues(getToken(req.user), req.query)
        .then(issuesData => render(req, res, {
            view: 'page-index',
            issues: issuesData.issues,
            pagination: issuesData.pagination
        }, {
            block: 'issues'
        }))
        .catch(err => onError(req, res, err));
}

function getComplexIssue(req, res) {
    const id = +req.params.id;
    const token = getToken(req.user);

    logger.log('getComplexIssue', id);

    return Promise.all(
        id > 0 ?
        [
            gh.getIssue(id, token),
            gh.getIssueComments(id, { token })
        ] :
        [
            archive.getIssue(id),
            archive.getIssueComments(id)
        ]
    )
        .then(responses => {
            const issue = responses[0].issues[0];
            const comments = responses[1];

            render(req, res, {
                view: 'page-post',
                issue,
                comments,
                title: issue.title,
                isPostPage: true
            });
        }).catch(err => onError(req, res, err));
}

function updateComment(req, res) {
    logger.log('update comment', req.params.id, 'with data', req.body);

    return gh.updateComment(req.params.id, req.body, getToken(req.user))
        .then(() => res.status(204).send('ok'))
        .catch(error => onError(req, res, error));
}

function updateIssue(req, res) {
    logger.log('update issue', req.params.id, 'with data', req.body);

    return gh.updateIssue(req.params.id, req.body, getToken(req.user))
        .then(() => res.status(204).send('ok'))
        .catch(error => onError(req, res, error));
}

function getComments(req, res) {
    gh.getIssueComments(req.params.id, { token: getToken(req.user) })
        .then(comments => render(req, res, {
            view: 'page-post',
            comments,
            issueId: req.params.id
        }, {
            block: 'comments'
        }))
        .catch(err => onError(req, res, err));
}

function getComment(req, res) {
    _getData(req, res, 'comment');
}

function getIssue(req, res) {
    _getData(req, res, 'issue');
}

function _getData(req, res, dataType) {
    logger.log('get' + dataType, req.params.id);

    const id = req.params.id;
    const token = getToken(req.user);
    const type = req.query.type;

    return (dataType === 'issue' ?
        gh.getIssue(id, token) :
        gh.getComment(id, { token })
    )
        .then(response => {
            const data = dataType === 'issue' ? response.issues[0] : response;

            type === 'form' ?
                render(
                    req, res, { view: 'page-post' },
                    Object.assign({
                        block: 'send-form',
                        mix: { block: dataType, elem: 'send-form' },
                        formType: dataType,
                        reqType: 'edit',
                        js: {
                            formType: dataType,
                            reqType: 'edit'
                        }
                    }, dataType === 'issue' ? { issue: data } : { comment: data })
                ) :
                res.json(data);
        }).catch(err => onError(req, res, err));
}

function addComment(req, res) {
    logger.log('addComment', req.params.id);

    return gh.addComment(req.params.id, req.body.text, getToken(req.user))
        .then(response => res.json(response.body.id))
        .catch(error => onError(req, res, error));
}

function deleteComment(req, res) {
    logger.log('deleteComment', req.params.id);

    return gh.deleteComment(req.params.id, getToken(req.user))
        .then(() => res.status(204).send('ok'))
        .catch(error => onError(req, res, error));
}

function get404(req, res) {
    logger.error('404', req.url);

    gh.getIssues(getToken(req.user))
        .then(issuesData => {
            res.status(404);
            render(req, res, {
                issues: issuesData.issues.slice(0, 10), // 10 last issues
                view: '404'
            });
        })
        .catch(err => onError(req, res, err));
}

module.exports = {
    getIndex,
    createIssuePage,
    createIssue,
    updateIssue,
    getIssues,
    getIssue,
    getComplexIssue,
    getComments,
    getComment,
    addComment,
    deleteComment,
    updateComment,
    get404
};
