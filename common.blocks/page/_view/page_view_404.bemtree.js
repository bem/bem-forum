block('page').mod('view', '404').content()(node => {
    const { block, i18n } = node;

    const error = {
        header: i18n(block, 'notFoundErrorHeader'),
        text: i18n(block, 'notFoundErrorContent')
    };

    return [
        {
            block: 'header'
        },
        {
            elem: 'content',
            content: [
                {
                    block: 'error-board',
                    mix: { block, elem: 'error-board' },
                    error
                },
                {
                    block: 'last-issues'
                }
            ]
        },
        {
            block: 'footer'
        }
    ];

});
