block('issues').content()(function() {
    const { data, block } = this;
    const pagination = data.pagination || {};

    return [
        {
            elem: 'content',
            content: this.data.issues.map(function(issue) {
                return {
                    block: 'issue',
                    mods: { state: issue.state, counts: this.data.issues.length === 1 },
                    issue: issue
                };
            }, this)
        },
        (pagination.next || pagination.prev) && {
            block: 'pager',
            mix: { block, elem: 'pager' }
        }
    ];
});
