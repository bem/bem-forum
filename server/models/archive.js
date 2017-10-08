/**
 * 1. The model is responsible for get and working with archival data.
 * 2. The contents of the archive is taken from the json file specified in the config app.
 * 3. The archive is divided into languages and repeats the data structure API Github.
 * 4. Supports methods to retrieve issues(issue) and comments and has their own methods for sorting,
 * which is exactly the same sort to API Github.
 */
const path = require('path');
const createError = require('http-errors');

const logger = require('../logger');
const config = require('../config');

const archiveData = (config.archives || []).reduce((acc, fileName) => {
    const data = readArchiveFile(fileName);

    acc.issues = acc.issues.concat(data.issues || []);
    acc.comments = acc.comments.concat(data.comments || []);

    return acc;
}, { issues: [], comments: [] });

const isEmpty = !archiveData.issues.length;

/**
 * Get the list of archived issues
 * 1. Filter by labels
 * 2. Sort by type and direction
 * 3. Filter by page and limit per page
 *
 * @param {object} options - options for pull issues
 *
 * @returns {Array.<object>}
 */
const getIssues = isEmpty ?
    () => Promise.resolve([]) :
    options => {
        let issues = archiveData.issues;

        issues = filterIssuesByLabels(issues, options.labels);
        issues = sortIssues(issues, options.sort, options.direction);
        issues = filterByPage(issues, options.page, options['per_page']);

        return Promise.resolve(issues);
    };

/**
 * Get a single archived issue
 *
 * @param {number} id - issue number
 *
 * @returns {object}
 */
const getIssue = isEmpty ?
    () => Promise.reject(createError(404, 'Not found')) :
    id => {
        const result = archiveData.issues.find(item => item.number === id);

        if (!result) return Promise.reject(createError(404, 'Not found'));

        return Promise.resolve({ issues: [result] });
    };

/**
 * Get the list of archived comments
 * Filtered by creation date in descending order, new in the end
 *
 * @param {object} id - comments issue id
 *
 * @returns {Array.<object>}
 */
const getIssueComments = isEmpty ?
    () => Promise.resolve([]) :
    id => Promise.resolve(archiveData.comments
        .filter(item => item.number == id)
        .sort((a, b) =>  Date.parse(a['created_at']) - Date.parse(b['created_at'])));

/**
 * Do safe sync archive file read
 * Expects valid json file format
 *
 * @param {string} filepath - path to archive file
 *
 * @returns {object}
 * @private
 */
function readArchiveFile(filepath) {
    try {
        return require(path.resolve(filepath));
    } catch (err) {
        logger.error('Failed to parse json file with the %s archive error: %s', filepath, err);

        return { issues: [], comments: [] };
    }
}

/**
 * Filter by labels
 * @param {Array.<object>} issues - list of issues
 * @param {Array.<object>} labels - labels to filter with
 *
 * @returns {Array.<object>} - array of filtered issues
 * @private
 */
function filterIssuesByLabels(issues, labels) {
    if (!labels) {
        return issues;
    }

    return issues.filter(issue => {
        // get issue label`s name
        const issueLabels = issue.labels.map(label => label.name);

        // must have all option labels articles
        return labels.every(label => issueLabels.includes(label));
    });
}

/**
 * Sort by type and direction
 *
 * @param {Array.<object>} issues - issues list
 * @param {string} field - field to sort with ('updated'|'created'|'comments')
 * @param {string} direction - 'desc'|'asc'
 *
 * @returns {Array.<object>} - array of filtered issues
 * @private
 */
function sortIssues(issues, field, direction) {
    const sortField = getSortField(field);
    const sortFieldDate = sortField + '_at';
    const order = getSortOrder(direction);

    return issues.sort((a, b) => {
        if (sortField === 'comments') {
            return order * (+a[sortField] - +b[sortField]);
        }

        return order * (Date.parse(a[sortFieldDate]) - Date.parse(b[sortFieldDate]));
    });
}

/**
 * Get correct sort field
 * Fallback in case the option is not specified sort field
 *
 * @param {string} field - the test sort field
 *
 * @returns {string} - type of sort
 * @private
 */
function getSortField(field) {
    return (field && /^(created|updated|comments)$/.test(field)) ? field : 'updated';
}

/**
 * Get a numeric sort order relative to the direction value
 *
 * @param {string} direction - 'desc'|'asc'
 *
 * @returns {number}
 * @private
 */
function getSortOrder(direction) {
    return getSortDirection(direction) === 'desc' ? -1 : 1;
}

/**
 * Get correct sort direction
 * Fallback in case the option is not specified sort direction
 *
 * @param {string} direction - the test sort field
 *
 * @returns {string} - direction
 * @private
 */
function getSortDirection(direction) {
    return (direction && /^(asc|desc)$/.test(direction)) ? direction : 'desc';
}

/**
 * Filter by page and limit per page
 *
 * @param {Array.<object>} issues - issues list
 * @param {number} currentPage - cuurent page number
 * @param {number} perPage - number of issues per page
 *
 * @returns {Array.<object>} - array of filtered issues
 * @private
 */
function filterByPage(issues, currentPage, perPage) {
    var page = currentPage || 1,
        limit = perPage || 20;

    // invert the negative value of the page
    if (page < 0) {
        page = Math.abs(page);
    }

    return issues.filter((issue, index) => (index >= limit * (page - 1)) && (index < limit * page));
}

module.exports = {
    getIssues,
    getIssue,
    getIssueComments
};
