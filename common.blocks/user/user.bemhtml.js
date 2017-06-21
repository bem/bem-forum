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

    elem('username').tag()('span')
);
