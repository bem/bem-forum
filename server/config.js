const env = process.env;
const config = {
    staticFolder: 'static',
    defaultPort: 3000,
    cacheTTL: 30000,

    sessionSecret: 'REPLACE_ME_WITH_RANDOM_STRING',
    langs: env.BEM_FORUM_LANGS ? env.BEM_FORUM_LANGS.split(',') : ['ru', 'en'],
    defaultLang: env.BEM_FORUM_DEFAULT_LANG || 'ru',

    ghAPI: 'https://api.github.com',
    org: 'bem-site',
    repo: 'bem-forum-content-en'
};

let secretConfig;

try {
    secretConfig = require('./secret-config');
} catch (err) {
    console.error('No "secret-config.js" file found...');
}

module.exports = Object.assign({}, secretConfig, config);
