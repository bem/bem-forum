block('header').content()(node => {
    const { block, i18n, data } = node;

    return [
        {
            block: 'logo',
            mix: { block: block, elem: 'logo' },
            url: '/'
        },
        {
            elem: 'breadcrumbs',
            items: [
                {
                    text: 'pisya',
                    url: '/'
                },
                data.issue && data.issue.title && {
                    text: data.issue.title
                }
            ]
        },
        node.data.user ? [
            {
                block: 'avatar',
                mix: { block: block, elem: 'avatar' },
                url: node.data.user.avatar
            },
            {
                block: block,
                elem: 'button-group',
                content: [
                    {
                        block: 'button',
                        mix: [
                            { block: block, elem: 'post' },
                            { block: block, elem: 'button' }
                        ],
                        mods: { theme: 'islands', size: 'm', view: 'action', type: 'link' },
                        text: i18n(block, 'writePost'),
                        url: data.pathPrefix + '/create'
                    },
                    {
                        block: 'button',
                        mix: { block: block, elem: 'button' },
                        mods: { theme: 'islands', size: 'm', type: 'link' },
                        text: i18n(block, 'exit'),
                        url: data.pathPrefix + '/logout'
                    }
                ]
            }
        ] : {
            block: 'button',
            mix: { block: block, elem: 'button' },
            mods: { theme: 'islands', size: 'm', view: 'action', type: 'link' },
            text: i18n(block, 'loginWithGh'),
            url: data.pathPrefix + '/auth/github'
        }
    ];
});
