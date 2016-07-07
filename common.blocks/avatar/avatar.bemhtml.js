block('avatar')(
    tag()('img'),
    attrs()(function() {
        var ctx = this.ctx;

        return this.extend(applyNext(), {
            src: ctx.url
        });
    })
);
