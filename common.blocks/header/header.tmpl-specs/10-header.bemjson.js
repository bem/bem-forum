module.exports = {
    block: 'header',
    content: [
        {
            block: 'logo',
            url: false
        },
        {
            block: 'button',
            mix: {
                block: 'header',
                elem: 'button'
            },
            mods: {
                theme: 'islands',
                size: 'm',
                view: 'action',
                type: 'link'
            },
            text: 'Войти с помощью github',
            url: '/auth/github'
        }
    ]
};
