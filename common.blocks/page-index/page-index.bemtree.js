block('page-index').content()(function() {
    var data = this.data,
        issues = data.issues;

    return [
        {
            elem: 'content',
            content: [
                issues && issues.length ? {
                    block: 'issues'
                } : ''
            ]
        },
        {
            elem: 'sidebar',
            content: [
                { block: 'labels' }
            ]
        }
    ];
});
