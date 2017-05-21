block('issue').content()(function() {
    var block = this.block;
    var issue = this.ctx.issue;
    var user = this.data.user || {};

    return [
        // TODO: maybe better to avoid element for one
        //       action and resolve it on actions level
        issue.user.id === user.id && {
            elem: 'actions',
            content: [
                 {
                    block: block,
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
            block: 'user',
            mods: { size: 'l' },
            user: issue.user
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
                    { block: block, elem: 'icon-resolved' },
                    { block: block, elem: 'title-icon' }
                ]
            }, {
                block: 'icon',
                mods: { bg: 'question-circle' },
                mix: [
                    { block: block, elem: 'icon-question' },
                    { block: block, elem: 'title-icon' }
                ]
            }, {
                block: 'link',
                url: '/' + issue.number + '/',
                content: issue.title
            }]
        },
        issue.labels.length ? {
            elem: 'labels',
            content: issue.labels.map(function(label) {
                return {
                    block: 'link',
                    mix: { block: 'issue', elem: 'label' },
                    url: '/?labels=' + label.name,
                    attrs: {
                        style: [
                            'color: #' + label.color,
                            'border: 1px solid #' + label.color
                        ].join(';')
                    },
                    content: label.name
                };
            })
        } : '',
        {
            elem: 'content',
            content: issue.html
        },
        this.data.url.pathname === '/' || this.data.view === '404' ? {
            block: 'button',
            mods: { theme: 'islands', size: 'm' },
            mix: { block: 'issue', elem: 'comments-button' },
            js: { number: issue.number },
            text: issue.comments ? 'Ответов: ' + issue.comments : 'Ответить'
        } : {
            block: 'comments',
            issueId: issue.number
        }
    ];
});
