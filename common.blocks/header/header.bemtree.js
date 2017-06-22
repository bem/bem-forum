block('header').content()(node => {
    const { block, i18n } = node;
    const pathname = node.data.url.pathname;

    return [
        {
            block: 'logo',
            url: pathname !== '/' && '/'
        },
        node.data.user ? [
            {
                block: 'avatar',
                mix: { block, elem: 'avatar' },
                url: node.data.user.avatar
            },
            {
                block: 'button',
                mix: { block: block, elem: 'button' },
                mods: { theme: 'islands', size: 'm', type: 'link' },
                text: i18n(block, 'exit'),
                url: '/logout'
            },
            {
                block: 'button',
                mix: [
                    { block: block, elem: 'post' },
                    { block: block, elem: 'button' }
                ],
                mods: { theme: 'islands', size: 'm', view: 'action', type: 'link' },
                text: i18n(block, 'writePost'),
                url: '/create'
            }
        ] : {
            block: 'button',
            mix: { block: block, elem: 'button' },
            mods: { theme: 'islands', size: 'm', view: 'action', type: 'link' },
            text: i18n(block, 'loginWithGh'),
            url: '/auth/github'
        }
    ];
});
