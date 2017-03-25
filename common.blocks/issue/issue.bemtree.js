block('issue').content()(function() {
    var issue = this.ctx.issue,
        currentUser = this.data.user || {},
        i18n = this.require('i18n');

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
        issue.user.login === currentUser.login && {
            block: 'issue',
            elem: 'issue-buttons',
            content: [
                {
                    block: 'button',
                    text: i18n(this.block, 'Delete'),
                    mods: { theme: 'islands', size: 'm' },
                    mix: { block: 'issue', elem: 'delete-button' }
                },
                {
                    block: 'modal',
                    mods: { theme: 'islands', autoclosable: true, visible: false },
                    mix: { block: 'issue', elem: 'delete-confirm-modal' },
                    content: [
                        {
                            block: 'issue',
                            elem: 'delete-modal-body',
                            elemMods: { visible: true },
                            content: [
                                i18n(this.block, 'DeleteAreYouSure'),
                                {
                                    block: 'button',
                                    mods: { theme: 'islands', size: 'm', view: 'action' },
                                    mix: { block: 'issue', elem: 'delete-modal-yes' },
                                    text: i18n(this.block, 'DeleteYes'),
                                    js: { number: issue.number }
                                },
                                {
                                    block: 'button',
                                    mods: { theme: 'islands', size: 'm' },
                                    mix: { block: 'issue', elem: 'delete-modal-no' },
                                    text: i18n(this.block, 'DeleteNo'),
                                }
                            ]
                        },
                        {
                            block: 'spin',
                            mods: { theme: 'islands', size: 'm', visible: false },
                            mix: { block: 'issue', elem: 'delete-spin' }
                        }
                    ]
                }
            ]
        },
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
        this.data.url.pathname === '/' || this.data.view === '404' ? {
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
