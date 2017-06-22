block('page-post').content()(node => {
    const { block, data, i18n } = node;
    const issue = data.issue;

    return [
        {
            elem: 'header',
            content: [
                {
                    block: 'link',
                    mix: { block, elem: 'link' },
                    content: i18n(block, 'blog'),
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
