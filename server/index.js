var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    router = require('./router'),
    app = express(),

    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    serveStatic = require('serve-static'),
    cookieSession = require('cookie-session'),
    slashes = require('connect-slashes'),
    render = require('./render').render,

    passport = require('passport'),
    config = require('./config'),
    staticFolder = config.staticFolder,

    port = process.env.PORT || config.defaultPort,
    isSocket = isNaN(port);

app
    .disable('x-powered-by')
    .enable('trust proxy')
    .use(favicon(path.join(staticFolder, 'favicon.ico')))
    .use(serveStatic(staticFolder))
    .use(morgan('combined'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(cookieSession({ keys: [config.sessionSecret] }))
    .use(passport.initialize())
    .use(passport.session())
    .use(slashes());
// TODO: csrf, gzip

app
    .use(router)
    .use(errorHandler);

/*eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
    res.status(500);
    render(req, res, { view: '500' });
}
/*eslint-enable no-alert */

isSocket && fs.existsSync(port) && fs.unlinkSync(port);

app.listen(port, function() {
    isSocket && fs.chmod(port, '0777');
    console.log('server is listening on', this.address().port);
});
