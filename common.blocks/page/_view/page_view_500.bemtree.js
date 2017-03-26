block('page').mod('view', '500').content()(function() {
    var block = this.block,
    i18n = this.require('i18n');

    return [
        {
            elem: 'wrapper',
            attrs: { style: 'margin: 20px; font-family: Verdana, Arial;' },
            content: [
                {
                    tag: 'h1',
                    content: i18n(block, 'internalServerError')
                },
                {
                    tag: 'p',
                    content: i18n(block, 'sorrySomthingWrong')
                },
                {
                    tag: 'p',
                    content: i18n(block, 'tryLater')
                }
            ]
        }
    ];
});
