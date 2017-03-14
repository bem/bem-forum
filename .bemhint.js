module.exports = {
    levels: [
        '*.blocks'
    ],

    excludePaths: [
        'node_modules/**'
    ],

    plugins: {
        'bemhint-css-naming': {
            techs: {
                styl: true,
                'post.css': false,
                css: true
            }
        },
        'bemhint-fs-naming': true,
        'bemhint-deps-specification': true
    }
};
