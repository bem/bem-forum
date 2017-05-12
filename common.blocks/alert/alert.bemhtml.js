block('alert')(
    content()(function() {
        return {
            block: this.block,
            elem: 'text',
            content: this.ctx.text
        };
    }),

    mod('has-icon', true).content()(function() {
        return [{
            block: this.block,
            elem: 'icon',
            content: this.ctx.icon
        }].concat(applyNext());
    })

);
