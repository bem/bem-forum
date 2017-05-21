block('user')(
    tag()('a'),
    attrs()(function() {
        return {
            href: this.ctx.user.html_url,
            target: '_blank'
        };
    }),
    content()(function() {
        var user = this.ctx.user;

        return [
            {
                elem: 'avatar',
                elemMods: { size: this.mods.size || 'm' },
                url: user.avatar_url
            },
            {
                elem: 'login',
                content: user.login
            }
        ];
    }),
    elem('avatar')(
        tag()('img'),
        attrs()(function() {
            return {
                src: this.ctx.url
            };
        })
    ),
    elem('login').tag()('span')
);
