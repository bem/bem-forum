block('issues').content()(function() {
    const { data, block, i18n } = this;
    const pagination = data.pagination || {};

    const issuesWithoutRemoved = data.issues.filter(i => !i.labels.length || !i.labels.some(l => l.name === 'removed'));

    return [
        {
            elem: 'content',
            content: issuesWithoutRemoved.length ? issuesWithoutRemoved.map(issue => ({
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
                mods: { state: issue.state, counts: issuesWithoutRemoved.length === 1 },
                issue: issue,
                userLogin: data.userLogin
            })) : {
                block: 'message',
                mix: { block, elem: 'message' },
                content: i18n(block, 'noPosts')
            }
        },
        (pagination.next || pagination.prev) && {
            block: 'pager',
            mix: { block, elem: 'pager' }
        }
    ];
});
