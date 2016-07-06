block('issue').content()(function() {
    var issue = this.ctx.issue;

    return [
        {
            block: 'user',
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
                url: '/' + issue.number + '/',
                content: issue.title
            }
        },
        issue.labels.length ? {
            elem: 'labels',
            content: issue.labels.map(function(label) {
                return {
                    elem: 'label',
                    content: {
                        block: 'link',
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
        this.data.url.pathname === '/' ? {
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