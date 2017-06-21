block('issue').content()(function() {
    var block = this.block;
    var issue = this.ctx.issue;
    var user = this.data.user || {};
    const isPostPage = !(this.data.url.pathname === '/' || this.data.view === '404');
    const i18n = this.require('i18n');

    return [
        {
            elem: 'header',
            content: [
                // TODO: maybe better to avoid element for one
                //       action and resolve it on actions level
                issue.user.id === user.id && {
                    elem: 'actions',
                    content: [
                        {
                            block,
                            elem: 'toggle-resolved',
                            mix: { block: block, elem: 'actions-button' },
                            issue: {
                                number: issue.number,
                                state: issue.state
                            }
                        }
                    ]
                },
                {
                    elem: 'date',
                    content: issue.created_from_now
                },
                {
                    elem: 'title',
                    content: [{
                        block: 'icon',
                        mods: { bg: 'check-circle' },
                        mix: [
                            { block, elem: 'icon-resolved' },
                            { block, elem: 'title-icon' }
                        ]
                    }, {
                        block: 'link',
                        mix: { block, elem: 'header-link' },
                        url: '/' + issue.number + '/',
                        content: issue.title
                    }]
                },
                {
                    block: 'user',
                    mix: { block, elem: 'user' },
                    user: issue.user
                },
                issue.labels.length ? { block: 'labels-list', mods: { inline: true }, labels: issue.labels } : ''
            ]
        },
        {
            elem: 'content',
            content: [
                {
                    block: 'md-body',
                    content: issue.html
                },
                {
                    block: 'button',
                    mods: {
                        disabled: isPostPage
                    },
                    mix: { block: 'issue', elem: 'comments-button' },
                    js: { number: issue.number },
                    text: issue.comments ?  `${i18n('issue', 'comments')}: ${issue.comments}` : i18n('issue', 'leaveComment')
                }
            ]
        },
        {
            elem: 'footer',
            content: !isPostPage ? '' : {
                block: 'comments',
                issueId: issue.number
            }
        }
    ];
});
