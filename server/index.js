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

    passport = require('passport'),
    config = require('./config'),
    staticFolder = config.staticFolder,

    port = process.env.PORT || config.defaultPort,
    isSocket = isNaN(port),
    isDev = process.env.NODE_ENV === 'development';

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

app.use(router);

if (isDev) {
    app.get('/error/', function() {
        throw new Error('Uncaught exception from /error');
    });

    app.use(require('errorhandler')());
}

isSocket && fs.existsSync(port) && fs.unlinkSync(port);

app.listen(port, function() {
    isSocket && fs.chmod(port, '0777');
    console.log('server is listening on', this.address().port);
});
