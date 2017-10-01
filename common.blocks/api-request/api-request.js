/**
 * @module api-request
 */
modules.define('api-request', [
    'jquery', 'uri__querystring', 'store'
], function(provide, $, Querystring, Store) {

    /**
     * Make fetch request to the API
     * @param {String} apiPath - API path whithout '/'
     * @param {Object} ajaxSettings - fetch AjaxSettings
     * @param {*} context - execution context
     * @returns {Promise<string>} - response text
     */
    function request(apiPath, ajaxSettings, context) {
        return request.raw(apiPath, ajaxSettings, context)
            .then(function(response) {
                return response.text();
            });
    }

    /**
     * Make raw fetch request to the API
     * @param {String} apiPath - API path whithout '/'
     * @param {Object} ajaxSettings - fetch AjaxSettings
     * @param {*} context - execution context
     * @returns {Request}
     */
    request.raw = function(apiPath, ajaxSettings, context) {
        var settings = request._prepareSettings(ajaxSettings || {});
        var url = Store.getData().pathPrefix + request._basePath + apiPath;

        if (context) {
            settings.context = context;
        }

        if (settings.query) {
            var qs = Querystring.stringify(settings.query);

            delete settings.query;

            url += (url.includes('?') ? '&' : '?') + qs;
        }

        return fetch(url, settings).then(checkStatus);
    };

    /**
     * POST request sugar
     * @param {String} apiPath - API path without '/'
     * @param {Object} data - JSON-serializable object, for transfering to server
     * @param {*} [context] - execution context
     * @returns {Request}
     */
    request.post = function(apiPath, data, context) {
        return request(apiPath, {
            method: 'POST',
            body: data
        }, context);
    };

    request.patch = function(apiPath, data, context) {
        return request(apiPath, {
            method: 'PATCH',
            body: data
        }, context);
    };

    /**
     * PATCH request sugar
     * @param {String} apiPath - API path without '/'
     * @param {Object} data - JSON-serializable object, for transfering to server
     * @param {*} [context] - execution context
     * @returns {Request}
     */
    request.patch = function(apiPath, data, context) {
        return request(apiPath, {
            method: 'PATCH',
            body: data
        }, context);
    };

    /**
     * POST request sugar
     * @param {String} apiPath - API path without '/'
     * @param {Object} data - JSON-serializable object, for transfering to server
     * @param {*} [context] - execution context
     * @returns {Request}
     */
    request.put = function(apiPath, data, context) {
        return request(apiPath, {
            method: 'PUT',
            body: data
        }, context);
    };

    /**
     * DELETE request sugar
     * @param {String} apiPath - API path without '/'
     * @param {Object} data - JSON-serializable object, for transfering to server
     * @param {*} [context] - execution context
     * @returns {Request}
     */
    request.delete = function(apiPath, data, context) {
        return request(apiPath, {
            method: 'DELETE',
            body: data
        }, context);
    };

    /**
     * Request setting tweak:
     *  - if body is an object, it adds contentType and serializes an object.
     * @param {Object} settings - fetch AjaxSettings
     * @returns {Object}
     * @private
     */
    request._prepareSettings = function(settings = {}) {
        var headers = settings.headers || {};

        if (!headers['content-type'] && $.isPlainObject(settings.body)) {
            headers['content-type'] = 'application/json; charset=UTF-8';
            settings.body = JSON.stringify(settings.body);
        }

        // If empty data or undefined will be passed to the body, then we have to delete such field
        if (!settings.body) {
            delete settings.body;
        }

        if (settings.method && settings.method.toUpperCase() !== 'GET') {
            headers['x-csrf-token'] = Store.getData().csrf;
        }

        settings.query || (settings.query = {});

        if (!settings.credentials) {
            settings.credentials = 'same-origin';
        }
        Object.keys(headers).length > 0 && (settings.headers = headers);

        return settings;
    };

    /**
     * API prefix
     * @type {string}
     * @private
     */
    request._basePath = '/api/';

    /**
     * Check success of the response by code.
     * @param {Response} response - fetch response @see @link https://developer.mozilla.org/en-US/docs/Web/API/Response
     * @return {Response|Error}
     */
    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        var error = new Error(response.statusText);

        error.response = response;
        throw error;
    }

    provide(request);
});
