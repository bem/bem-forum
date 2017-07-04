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
            mix: [
                { block, elem: 'issue' },
                {
                    block: 'editing',
                    js: {
                        formType: 'issue',
                        entityId: issue.number
                    }
                }
            ],
            mods: { state: issue.state },
            issue
        }
    ];
});
