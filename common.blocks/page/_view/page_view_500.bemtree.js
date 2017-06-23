block('page').mod('view', '500').content()(node => {
    const { block, i18n } = node;

    const error = {
        header: i18n(block, 'serverErrorHeader'),
        text: i18n(block, 'serverErrorContent')
    };

    return [
        { block: 'header' },
        {
            elem: 'content',
            content: {
                block: 'error-board',
                mix: { block, elem: 'error-board' },
                error
            }
        },
        { block: 'footer' }
    ];
});
