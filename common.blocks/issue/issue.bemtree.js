block('issue').content()(function() {
    var issue = this.ctx.issue,
        i18n = this.require('i18n');

        //Check if user is logged and author of current task
    var isIssueAuthor = (typeof this.data.user !== 'undefined' && this.data.user.id === issue['user']['id']),
        //Check if current page is page of one issue
        isIssuePage = this.data.url.pathname !== '/';

    return [
        {
            block: 'user',
            mix: { block: 'page', elem: 'link' },
            user: issue.user
        },
        {
            elem: 'date',
            content: issue.created_from_now
        },
        {
            elem: 'container',
            content: [
                {
                    elem: 'title',
                    content: {
                        block: 'link',
                        mix: { block: 'page', elem: 'link' },
                        url: '/' + issue.number + '/',
                        content: issue.title
                    }
                },
                issue.labels.length ? {
                    elem: 'labels',
                    content: issue.labels.map(function(label) {
                        return {
                            elem: 'label',
                            attrs: { style: 'border: 1px solid #' + label.color },
                            content: {
                                block: 'link',
                                mix: { block: 'page', elem: 'link' },
                                url: '/?labels=' + label.name,
                                attrs: { style: 'color: #' + label.color },
                                content: label.name
                            }
                        };
                    })
                } : '',
                {
                    elem: 'content',
                    content: issue.html
                },
                {
                    elem: 'spiner-overlay',
                    content: {
                        elem: 'loader',
                        content: {
                            block: 'spin',
                            mix: { block: 'content', elem: 'spin' },
                            mods: { theme: 'islands', size: 'xl', visible: false }
                        }
                    }
                }
            ]
        },
        (issue['state'] === 'closed') ? {
            block: 'button',
            tag: 'div',
            mods: { theme: 'islands', size: 'm', type: 'submit', view: 'pseudo', disabled: true },
            mix: { block: 'issue', elem: 'has_answer_label' },
            text: (isIssueAuthor) ? i18n(this.block, 'iGotAnswer') : i18n(this.block, 'hasAnswer')
        }: '',
        (isIssueAuthor && isIssuePage) ? {
            block: 'button',
            mods: { theme: 'islands', size: 'm', type: 'link', view: 'action' },
            mix: { block: 'issue', elem: 'close-button' },
            url: '/api/set_issue_state/' + issue.number + ((issue['state'] === 'open') ? '/closed/' : '/open/'),
            text: (issue['state'] === 'open') ? i18n(this.block, 'closeIssue') : i18n(this.block, 'reopenIssue')
        } : '',
        (!isIssuePage || this.data.view === '404') ? {
            block: 'button',
            mods: { theme: 'islands', size: 'm', type: 'link', view: 'pseudo' },
            mix: { block: 'issue', elem: 'comments-button' },
            js: { number: issue.number },
            url: '/' + issue.number + '/',
            text: issue.comments ? 'Ответов: ' + issue.comments : 'Ответить'
        } : {
           block: 'comments'
        }
    ];
});
