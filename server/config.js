const config = {
    staticFolder: 'static',
    defaultPort: 3000,
    cacheTTL: 30000,

    sessionSecret: 'REPLACE_ME_WITH_RANDOM_STRING',
    langs: ['ru', 'en'],
    defaultLang: 'ru',

    ghAPI: 'https://api.github.com',
    org: 'LISBON11',
    repo: 'Lead'

    // org: 'bem-site',
    // repo: 'bem-forum-content-en'
};

let secretConfig;

try {
    secretConfig = require('./secret-config');
} catch (err) {
    console.error('No "secret-config.js" file found...');
}

module.exports = Object.assign({}, secretConfig, config);
