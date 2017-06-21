block('issues').content()(function() {
    const { data, block } = this;
    const pagination = data.pagination || {};

    return [
        {
            elem: 'content',
            content: data.issues.map(issue => ({
                block: 'issue',
                mix: { block, elem: 'issue' },
                mods: { state: issue.state, counts: this.data.issues.length === 1 },
                issue: issue
            }))
        },
        (pagination.next || pagination.prev) && {
            block: 'pager',
            mix: { block, elem: 'pager' }
        }
    ];
});
