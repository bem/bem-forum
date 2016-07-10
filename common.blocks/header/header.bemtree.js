block('header').content()(function() {
    var block = this.block;

    return [
        {
            block: 'logo'
        },
        this.data.user ? [
            {
                block: 'avatar',
                url: this.data.user.avatar
            },
            {
                block: 'button',
                mix: { block: block, elem: 'button' },
                mods: { theme: 'islands', size: 'm', type: 'link' },
                text: 'Выйти',
                url: '/logout'
            },
            {
                block: 'button',
                mix: [
                    { block: block, elem: 'post' },
                    { block: block, elem: 'button' }
                ],
                mods: { theme: 'islands', size: 'm', view: 'action' },
                text: 'Написать пост'
            }
        ] : {
            block: 'button',
            mix: { block: block, elem: 'button' },
            mods: { theme: 'islands', size: 'm', view: 'action', type: 'link' },
            text: 'Войти с помощью github',
            url: '/auth/github'
        }
    ];
});
