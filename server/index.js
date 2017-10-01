var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    router = require('./router'),
    app = express(),

    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    serveStatic = require('serve-static'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    slashes = require('connect-slashes'),
    passport = require('passport'),
    csrf = require('csurf'),
    compression = require('compression'),

    config = require('./config'),
    staticFolder = config.staticFolder,

    Render = require('./render'),
    render = Render.render,
    controllers = require('./controllers'),

    port = process.env.PORT || config.defaultPort,
    isSocket = isNaN(port),
    isDev = process.env.NODE_ENV === 'development';

require('debug-http')();

app
    .disable('x-powered-by')
    .enable('trust proxy')
    .use(compression())
    .use(favicon(path.join(staticFolder, 'favicon.ico')))
    .use(config.pathPrefix, serveStatic(staticFolder))
    .use(morgan('combined'))
    .use(cookieParser())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cookieSession({ keys: [config.sessionSecret] }))
    .use(passport.initialize())
    .use(passport.session())
    .use(csrf());

// NOTE: conflicts with livereload
isDev || app.use(slashes());

app.use(config.pathPrefix, router);

isDev && require('./rebuild')(app);
app.use(controllers.gh.get404);

/* eslint-disable no-unused-vars */
app.use(function errorHandler(err, req, res, next) {
    res.status(500);
    render(req, res, { view: '500' });
});
/* eslint-enable no-alert */

isSocket && fs.existsSync(port) && fs.unlinkSync(port);

app.listen(port, function() {
    isSocket && fs.chmod(port, '0777');
    console.log('server is listening on', this.address().port);
});
