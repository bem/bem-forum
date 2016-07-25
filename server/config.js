module.exports = {
    staticFolder: 'static',
    defaultPort: 3000,
    cacheTTL: 30000,

    sessionSecret: 'REPLACE_ME_WITH_RANDOM_STRING',
    langs: ['ru', 'en'],
    defaultLang: 'ru',

    ghAPI: 'https://api.github.com',
    org: 'bem',
    repo: 'bem-forum-content-en',

    userRights: {
        usual: ['user:email', 'public_repo']
    }
};
