module.exports = {
    block: 'header',
    content: [
        {
            block: 'logo',
            url: false
        },
        [
            {
                block: 'avatar',
                mix: {
                    block: 'header',
                    elem: 'avatar'
                },
                url: 'https://avatars3.githubusercontent.com/u/14638147?v=3'
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
                    type: 'link'
                },
                text: 'Выйти',
                url: '/logout'
            },
            {
                block: 'button',
                mix: [
                    {
                        block: 'header',
                        elem: 'post'
                    },
                    {
                        block: 'header',
                        elem: 'button'
                    }
                ],
                mods: {
                    theme: 'islands',
                    size: 'm',
                    view: 'action',
                    type: 'link'
                },
                text: 'Написать пост',
                url: '/create'
            }
        ]
    ]
};
