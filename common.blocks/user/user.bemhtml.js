block('user')(
    tag()('a'),
    attrs()(function() {
        return {
            href: this.ctx.user.html_url
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
    elem('login').tag()('span')
);