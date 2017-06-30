block('last-issues').content()(node => {
    const { block, i18n } = node;

    return [
        {
            elem: 'title',
            content: i18n(block, 'lastIssues')
        },
        {
            block: 'issues',
            mix: { block, elem: 'issues' }
        }
    ];
});
