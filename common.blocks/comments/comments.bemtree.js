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

        const userProfileId = data.user.id;

        return [
            {
                block: block,
                elem: 'list',
                content: data.comments.map(comment => ({
                    block: 'comment',
                    mix: [
                        { block, elem: 'comment' },
                        {
                            block: 'editing',
                            js: {
                                formType: 'comment',
                                entityId: comment.id
                            }
                        }],
                    user: comment.user,
                    created_from_now: comment.created_from_now,
                    html: comment.html,
                    js: {
                        commentId: comment.id
                    },
                    userProfileId: userProfileId
                }))
            },
            data.user ? {
                block: 'editing',
                js: {
                    formType: 'comment',
                    entityId: node.ctx.js.issueId
                },
                content: {
                    block: 'send-form',
                    formType: 'comment',
                    reqType: 'post',
                    js: {
                        user: node.data.user,
                        issueId: node.ctx.js.issueId
                    }
                }
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
