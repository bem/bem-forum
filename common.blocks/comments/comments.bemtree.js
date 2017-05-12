block('comments')(
    def()(function() {
        this.ctx.js = Object.assign({}, this.ctx.js, { issueId: this.ctx.issueId || this.data.issueId });

        return applyNext();
    }),

    content()(function() {
        const block = this.block;

        return [
            {
                block: block,
                elem: 'list',
                content: this.data.comments.map(function(comment) {
                    return {
                        block: 'comment',
                        comment: comment
                    };
                })
            },
            this.data.user ? {
                block: 'add-form',
                mix: { block: block, elem: 'add-comment-form' }
            } : 'Чтобы оставлять комментарии, небоходимо авторизоваться.'
        ];
    })
);
