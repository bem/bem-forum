block('user').content()((node, ctx) => {
    const { block } = node;
    const user = ctx.user;

    return  {
        block: 'link',
        mix: { block, elem: 'link' },
        url: user.html_url,
        target: '_blank',
        content: [
            {
                block,
                elem: 'avatar',
                mix: { block: 'avatar' },
                url: user.avatar_url
            },
            {
                block,
                elem: 'username',
                content: user.login
            }
        ]
    };
});
