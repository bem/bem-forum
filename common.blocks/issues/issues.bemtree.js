block('issues').content()(function() {
    const { data, block } = this;
    const pagination = data.pagination || {};

    return [
        {
            elem: 'content',
            content: data.issues.length ? data.issues.map(issue => ({
                block: 'issue',
                mix: { block, elem: 'issue' },
                mods: { state: issue.state, counts: this.data.issues.length === 1 },
                issue: issue,
                userLogin: data.userLogin
            })) : {
                block: 'message',
                mix: { block, elem: 'message' },
                content: 'No posts found'
            }
        },
        (pagination.next || pagination.prev) && {
            block: 'pager',
            mix: { block, elem: 'pager' }
        }
    ];
});
