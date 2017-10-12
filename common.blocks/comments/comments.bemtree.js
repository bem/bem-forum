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
        const { block, data } = node;

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
                        }
                    ],
                    user: comment.user,
                    created_from_now: comment.created_from_now,
                    html: comment.html,
                    js: {
                        commentId: comment.id
                    },
                    userProfileId: data.user ? data.user.id : null
                }))
            },
            {
                elem: 'editing',
                issueId: node.ctx.js.issueId
            }
        ];
    }),

    elem('editing').replace()((node, ctx) => {
        const { data, i18n, block } = node;

        if (data.issue && data.issue.isArchived) return '';
        if (data.user) {
            return {
                block: 'editing',
                js: {
                    formType: 'comment',
                    entityId: ctx.issueId
                },
                content: {
                    block: 'send-form',
                    formType: 'comment',
                    reqType: 'post',
                    js: {
                        user: node.data.user,
                        issueId: ctx.issueId,
                        formType: 'comment'
                    }
                }
            };
        }

        return {
            elem: 'auth-suggest',
            content: [
                i18n(block, 'loginWarning'),
                {
                    block: 'link',
                    url: data.pathPrefix + '/auth/github',
                    content: i18n(block, 'authorize')
                }
            ]
        };
    })
);
