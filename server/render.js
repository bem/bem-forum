var path = require('path'),
    config = require('./config'),
    langs = config.langs,
    bundleName = 'index',
    pathToBundle = path.resolve('desktop.bundles', bundleName),
    BEMTREE = langs.reduce(function(acc, lang) {
        acc[lang] = require(path.join(pathToBundle, bundleName + '.' + lang + '.bemtree.js')).BEMTREE
        return acc;
    }, {}),
    BEMHTML = require(path.join(pathToBundle, bundleName + '.bemhtml.js')).BEMHTML,

    isDev = process.env.NODE_ENV === 'development',
    useCache = !isDev,
    cacheTTL = config.cacheTTL,
    cache = {};

function render(req, res, data, context) {
    var query = req.query,
        passport = req.session.passport,
        user = passport && passport.user && JSON.parse(passport.user),
        cacheKey = req.url + (context ? JSON.stringify(context) : '') + (user ? JSON.stringify(user) : ''),
        cached = cache[cacheKey],
        lang = langs.indexOf(query.lang) > -1 ? query.lang : config.defaultLang;

    if (useCache && cached && (new Date() - cached.timestamp < cacheTTL)) {
        return res.send(cached.html);
    }

    if (isDev && query.json) { return res.send('<pre>' + JSON.stringify(data, null, 4) + '</pre>'); }

    var bemtreeCtx = {
        block: 'root',
        context: context,
        // extend with data needed for all routes
        data: Object.assign({}, {
            user: user,
            url: req._parsedUrl
        }, data)
    };

    try {
        var bemjson = BEMTREE[lang].apply(bemtreeCtx);
    } catch(err) {
        console.error('BEMTREE error', err.stack);
        console.trace('server stack');
        return res.sendStatus(500);
    }

    if (isDev && query.bemjson) { return res.send('<pre>' + JSON.stringify(bemjson, null, 4) + '</pre>'); }

    try {
        var html = BEMHTML.apply(bemjson);
    } catch(err) {
        console.error('BEMHTML error', err.stack);
        return res.sendStatus(500);
    }

    useCache && (cache[cacheKey] = {
        timestamp: new Date(),
        html: html
    });

    res.send(html);
}

function dropCache() {
    cache = {};
}

module.exports = {
    render: render,
    dropCache: dropCache
};
