block('header').content()(function() {

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
                mix: { block: 'header', elem: 'button' },
                mods: { theme: 'islands', size: 'm', type: 'link' },
                text: 'Выйти',
                url: '/logout'
            },
            {
                block: 'button',
                mix: [
                    { block: 'header', elem: 'post' },
                    { block: 'header', elem: 'button' }
                ],
                mods: { theme: 'islands', size: 'm', view: 'action' },
                text: 'Написать пост'
            }
        ] : {
            block: 'button',
            mix: { block: 'header', elem: 'button' },
            mods: { theme: 'islands', size: 'm', view: 'action', type: 'link' },
            text: 'Войти с помощью github',
            url: '/auth/github'
        }
    ];
});
