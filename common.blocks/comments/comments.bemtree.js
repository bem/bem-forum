block('comments')(
    def()(function() {
        var user = this.data.user;

        this.ctx.js = Object.assign({}, this.ctx.js, {
            issueId: this.ctx.issueId || this.data.issueId,
            user: {
                avatar_url: user.avatar,
                login: user.login
            }
        });

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
                        mix: { block, elem: 'comment' },
                        user: comment.user,
                        created_from_now: comment.created_from_now,
                        html: comment.html
                    };
                })
            },
            this.data.user ? {
                block: 'add-form',
                mix: { block, elem: 'add-comment-form' }
            } : 'Чтобы оставлять комментарии, небоходимо авторизоваться.'
        ];
    })
);
