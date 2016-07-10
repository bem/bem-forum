var techs = {
        fileProvider: require('enb/techs/file-provider'),
        fileMerge: require('enb/techs/file-merge'),
        borschik: require('enb-borschik/techs/borschik'),
        css: require('enb-css/techs/css'),
        postcss: require('enb-bundle-postcss/techs/enb-bundle-postcss'),
        i18NTech: require('enb-bem-i18n/techs/i18n'),
        keysetsTech: require('enb-bem-i18n/techs/keysets'),
        browserJs: require('enb-js/techs/browser-js'),
        bemtree: require('enb-bemxjst/techs/bemtree'),
        bemhtml: require('enb-bemxjst/techs/bemhtml')
    },
    enbBemTechs = require('enb-bem-techs'),
    levels = [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/desktop.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/desktop.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/design/desktop.blocks', check: false },
        { path: 'libs/bem-history/common.blocks', check: false },
        'common.blocks'
    ];

var isProd = process.env.YENV === 'production';
isProd || levels.push('development.blocks');

module.exports = function(config) {
    config.setLanguages(['en', 'ru']);

    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: levels }],
            [techs.fileProvider, { target: '?.bemdecl.js' }],
            [enbBemTechs.deps],
            [enbBemTechs.files],

            // css
            [techs.css, {
                target: '?.pre.css',
                // TODO: move to postcss
                autoprefixer: { browsers: ['ie >= 10', 'last 2 versions', 'opera 12.1', '> 2%'] }
            }],

            [techs.postcss, {
                source: '?.pre.css',
                plugins: [require('rebem-css'), require('postcss-nested')]
            }],


            // Build keyset files for each lang
            [techs.keysetsTech, { lang: '{lang}' }],

            // Build i18n files for each lang
            [techs.i18NTech, {
                lang: '{lang}',
                exports: { globals: 'force' }
            }],

            // bemtree
            [techs.bemtree, {
                sourceSuffixes: ['bemtree', 'bemtree.js'],
                requires: { i18n: { globals: 'BEM.I18N' } }
            }],

            [techs.fileMerge, {
                sources: ['?.lang.{lang}.js', '?.bemtree.js'],
                target: '?.{lang}.bemtree.js',
                lang: '{lang}'
            }],

            // templates
            [techs.bemhtml, { sourceSuffixes: ['bemhtml', 'bemhtml.js'] }],

            // client templates
            [enbBemTechs.depsByTechToBemdecl, {
                target: '?.tmpl.bemdecl.js',
                sourceTech: 'js',
                destTech: 'bemhtml'
            }],
            [enbBemTechs.deps, {
                target: '?.tmpl.deps.js',
                bemdeclFile: '?.tmpl.bemdecl.js'
            }],
            [enbBemTechs.files, {
                depsFile: '?.tmpl.deps.js',
                filesTarget: '?.tmpl.files',
                dirsTarget: '?.tmpl.dirs'
            }],
            [techs.bemhtml, {
                target: '?.browser.bemhtml.js',
                filesTarget: '?.tmpl.files',
                sourceSuffixes: ['bemhtml', 'bemhtml.js']
            }],

            // js
            [techs.browserJs, { includeYM: true }],
            [techs.fileMerge, {
                target: '?.js',
                sources: ['?.browser.js', '?.browser.bemhtml.js']
            }],

            // borschik
            [techs.borschik, { source: '?.js', target: '?.min.js', minify: isProd }],
            [techs.borschik, { source: '?.css', target: '?.min.css', minify: isProd }]
        ]);

        nodeConfig.addTargets(['?.{lang}.bemtree.js', '?.bemhtml.js', '?.min.css', '?.min.js']);
    });
};
