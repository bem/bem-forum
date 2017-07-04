block('user')(
    elem('link').attrs()(function() {
        return {
            href: this.ctx.user.html_url,
            target: '_blank'
        };
    }),

    elem('avatar')(
        tag()('img'),

        attrs()(function() {
            return {
                src: this.ctx.url
            };
        })
    ),

    elem('username').tag()('span'),

    content()((node, ctx) => {
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
                    content: user.login,
                    tag: 'span'
                }
            ]
        };
    })
);
