block('comments')(
    def()(function() {
        const user = this.data.user;

        this.ctx.js = Object.assign(
            {},
            this.ctx.js,
            { issueId: this.ctx.issueId || this.data.issueId },
            user ? { user: { avatar_url: user.avatar, login: user.login } } : {}
        );

        return applyNext();
    }),

    content()(node => {
        const { block, i18n, data } = node;

        return [
            {
                block: block,
                elem: 'list',
                content: data.comments.map(comment => ({
                    block: 'comment',
                    mix: { block, elem: 'comment' },
                    user: comment.user,
                    created_from_now: comment.created_from_now,
                    html: comment.html
                }))
            },
            data.user ? {
                block: 'add-form',
                mix: { block, elem: 'add-comment-form' }
            } : {
                elem: 'auth-suggest',
                content: [
                    i18n(block, 'loginWarning'),
                    {
                        block: 'link',
                        url: '/auth/github',
                        content: i18n(block, 'authorize')
                    }
                ]
            }
        ];
    })
);
