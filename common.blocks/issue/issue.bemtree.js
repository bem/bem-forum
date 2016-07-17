block('issue').content()(function() {
    var issue = this.ctx.issue;

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
