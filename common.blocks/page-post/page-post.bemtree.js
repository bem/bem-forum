block('page-post').content()(function() {
    const { block, data } = this;
    const issue = data.issue;
    const i18n = this.require('i18n');

    return [
        {
            elem: 'header',
            content: [
                {
                    block: 'link',
                    mix: { block, elem: 'link' },
                    content: i18n('page-post', 'blog'),
                    url: '/'
                },
                '&nbsp;/'
            ]
        },
        {
            block: 'issue',
            mods: { state: issue.state },
            issue
        }
    ];
});
