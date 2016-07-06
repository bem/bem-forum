var Render = require('../render'),
    render = Render.render,
    dropCache = Render.dropCache;

function main(req, res) {
    render(req, res, {
        view: 'index',
        title: 'Main page',
        user: 'kto-to',
        meta: {
            description: 'Page description',
            og: {
                url: 'https://site.com',
                siteName: 'Site name'
            }
        }
    })
}

module.exports = main;