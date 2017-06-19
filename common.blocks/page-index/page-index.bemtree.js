block('page-index').content()(function() {
    const { block, data } = this;
    const issues = data.issues;

    return [
        {
            elem: 'content',
            content: issues && issues.length ? {
                block: 'issues'
            } : ''
        },
        {
            block: 'sidebar',
            mix: { block, elem: 'sidebar' }
        }
    ];
});
