var techs = {
        fileProvider: require('enb/techs/file-provider'),
        fileMerge: require('enb/techs/file-merge'),
        fileCopy: require('enb/techs/file-copy'),
        borschik: require('enb-borschik/techs/borschik'),
        postcss: require('enb-postcss/techs/enb-postcss'),
        postcssPlugins: [
            require('postcss-import')(),
            require('postcss-each'),
            require('postcss-for'),
            require('postcss-simple-vars')(),
            require('postcss-calc')(),
            require('postcss-nested'),
            require('rebem-css'),
            require('postcss-url')({ url: 'rebase' }),
            require('autoprefixer')()
        ],
        i18NTech: require('enb-bem-i18n/techs/i18n'),
        bemtreeI18N: require('enb-bemxjst-i18n/techs/bemtree-i18n'),
        keysetsTech: require('enb-bem-i18n/techs/keysets'),
        browserJs: require('enb-js/techs/browser-js'),
        bemhtml: require('enb-bemxjst/techs/bemhtml')
    },
    enbBemTechs = require('enb-bem-techs'),
    levels = [
        { path: 'node_modules/bem-core/common.blocks', check: false },
        { path: 'node_modules/bem-core/desktop.blocks', check: false },
        { path: 'node_modules/bem-components/common.blocks', check: false },
        { path: 'node_modules/bem-components/desktop.blocks', check: false },
        { path: 'node_modules/bem-components/design/common.blocks', check: false },
        { path: 'node_modules/bem-components/design/desktop.blocks', check: false },
        { path: 'node_modules/bem-history/common.blocks', check: false },
        { path: 'node_modules/bem-textarea-editor/common.blocks', check: false },
        { path: 'node_modules/bem-font-awesome-icons', check: false },
        'common.blocks'
    ];

var isProd = process.env.YENV === 'production';
isProd || levels.push('development.blocks');

var bemhtmlOptions = {
    sourceSuffixes: ['bemhtml', 'bemhtml.js'],
    forceBaseTemplates: true,
    engineOptions: { elemJsInstances: true }
};

module.exports = function(config) {
    config.setLanguages(['en', 'ru']);

    config.includeConfig('enb-bem-tmpl-specs'); // Подключаем `enb-bem-tmpl-specs` модуль.

    var examples = config.module('enb-bem-tmpl-specs') // Создаём конфигуратор сетов
        .createConfigurator('tmpl-specs', {            // в рамках таска `specs`.
            coverage: {                                // Определяем общие опции для всех уровней-сетов.
                engines: ['bemhtml']
            }
        });

    examples.configure({
        destPath: 'common.tmpl-specs',
        levels: ['common.blocks'],
        sourceLevels: levels,
        engines: {
            'bemhtml': {
                tech: 'enb-bemxjst/techs/bemhtml',
                options: bemhtmlOptions
            }
        }
    });

    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: levels }],
            [techs.fileProvider, { target: '?.bemdecl.js' }],
            [enbBemTechs.deps],
            [enbBemTechs.files],

            // css
            [techs.postcss, {
                target: '?.css',
                oneOfSourceSuffixes: ['post.css', 'css'],
                plugins: techs.postcssPlugins
            }],

            // Build keyset files for each lang
            [techs.keysetsTech, { lang: '{lang}' }],

            // Build i18n files for each lang
            [techs.i18NTech, {
                lang: '{lang}',
                exports: { ym: true, commonJS: true }
            }],

            // bemtree
            [techs.bemtreeI18N, {
                target: '?.{lang}.bemtree.js',
                sourceSuffixes: ['bemtree.js'],
                lang: '{lang}',
                requires: {}
            }],

            // templates
            [techs.bemhtml, bemhtmlOptions],

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
                sourceSuffixes: ['bemhtml', 'bemhtml.js'],
                engineOptions: { elemJsInstances: true }
            }],

            // js
            [techs.browserJs, { includeYM: true }],
            [techs.fileMerge, {
                target: '?.js',
                sources: ['?.browser.js', '?.browser.bemhtml.js']
            }],

            // borschik
            [techs.borschik, { source: '?.js', target: '?.min.js', minify: isProd }],
            [techs.borschik, { source: '?.css', target: '?.min.css', minify: isProd }],

            [techs.fileCopy, { source: '?.min.js', target: '../../static/?.min.js' }],
            [techs.fileCopy, { source: '?.min.css', target: '../../static/?.min.css' }]
        ]);

        nodeConfig.addTargets(['?.{lang}.bemtree.js', '?.bemhtml.js', '../../static/?.min.js', '../../static/?.min.css']);
    });
};
