block('issue').content()(function() {
    var issue = this.ctx.issue,
        i18n = this.require('i18n'),
        data = this.data,
        //Check if user is logged and author of current task
        isIssueAuthor = (typeof data.user !== 'undefined' && data.user.id === issue['user']['id']),
        //Check if current page is page of one issue
        isIssuePage = data.url.pathname !== '/',
        //Check if current issue is open
        isIssueOpen = issue['state'] === 'open';

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
        !isIssueOpen ? {
            block: 'button',
            tag: 'div',
            mods: { theme: 'islands', size: 'm', type: 'submit', view: 'plain', disabled: true },
            mix: { block: 'issue', elem: 'has-answer-label' },
            icon : {
                block : 'icon',
                tag: 'span',
                content: {
                    tag: 'svg',
                    attrs: {xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '-1 2 47 47'},
                    content: '<path d="M33.5,20.9V13c0-6-4.9-11-11-11c-6,0-11,4.9-11,11v7.9H6.5V49h32.1V20.9H33.5z M17,13c0-3,2.5-5.5,5.5-5.5S28,9.9,28,13v7.9H17C17,20.9,17,13,17,13z M20.8,43.9l-10.2-7.2l3.2-6l7.3,6.1l10.5-10.3l2.8,4.8L20.8,43.9z"/>'
                }
            },
            text: i18n(this.block, isIssueAuthor ? 'iGotAnswer' : 'hasAnswer')
        }: '',
        isIssueAuthor && isIssuePage ? {
            block: 'button',
            mods: { theme: 'islands', size: 'm', type: 'link', view: 'action' },
            mix: { block: 'issue', elem: 'close-button' },
            url: '/api/set_issue_state/' + issue.number + (isIssueOpen ? '/closed/' : '/open/'),
            text: i18n(this.block, isIssueOpen ? 'closeIssue' : 'reopenIssue')
        } : '',
        !isIssuePage ? {
            block: 'button',
            mods: { theme: 'islands', size: 'm', type: 'link', view: 'pseudo' },
            mix: { block: 'issue', elem: 'comments-button' },
            js: { number: issue.number },
            url: '/' + issue.number + '/',
            text: issue.comments ? i18n(this.block, 'replies') + ': ' + issue.comments : i18n(this.block, 'reply')
        } : {
            block: 'comments'
        }
    ];
});
