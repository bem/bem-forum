block('header').content()(function() {
    return [
        {
            block: 'logo'
        },
        this.data.user ? [
            {
                block: 'avatar'
            },
            {
                block: 'button',
                mods: { theme: 'islands', size: 'm', view: 'action' },
                text: 'Написать пост'
            },
            {
                block: 'button',
                mods: { theme: 'islands', size: 'm' },
                text: 'Выйти'
            }
        ] : {
            block: 'button',
            mix: { block: 'header', elem: 'button' },
            mods: { theme: 'islands', size: 'm', view: 'action' },
            text: 'Войти с помощью github'
        }
    ];
});
