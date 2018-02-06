block('header').content()(node => {
    const { block, i18n, data } = node;

    return [
        {
            elem: 'left-column',
            content: [
                {
                    block: 'logo',
                    mix: { block: block, elem: 'logo' },
                    url: '/'
                },
                {
                    elem: 'breadcrumbs',
                    items: [
                        {
                            text: i18n(block, 'forum'),
                            url: data.pathPrefix + '/'
                        },
                        data.issue && data.issue.title && {
                            text: data.issue.title
                        }
                    ]
                }
            ]
        },
        {
            elem: 'right-column',
            content: node.data.user ? [
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
                },
                {
                    block: 'avatar',
                    mix: { block: block, elem: 'avatar' },
                    url: node.data.user.avatar
                }
            ] : {
                block: 'button',
                mix: { block: block, elem: 'button' },
                mods: { theme: 'islands', size: 'm', view: 'action', type: 'link' },
                text: i18n(block, 'loginWithGh'),
                url: data.pathPrefix + '/auth/github'
            }
        }
    ];
});
