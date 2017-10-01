block('page').mod('view', '401').content()(node => {
    const { block, i18n } = node;

    const error = {
        header: i18n(block, 'authErrorHeader'),
        text: i18n(block, 'authErrorContent')
    };

    return [
        { block: 'header' },
        {
            elem: 'content',
            content: [
                {
                    block: 'error-board',
                    mix: { block, elem: 'error-board' },
                    error
                },
                {
                    elem: 'auth-suggest',
                    content: {
                        block: 'button',
                        mix: { block: block, elem: 'button' },
                        mods: { theme: 'islands', size: 'm', view: 'action', type: 'link' },
                        text: i18n(block, 'loginWithGh'),
                        url: node.data.pathPrefix + '/auth/github'
                    }
                }
            ]
        },
        { block: 'footer' }
    ];
});

