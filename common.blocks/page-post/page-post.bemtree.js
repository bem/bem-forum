block('page-post').content()(node => {
    const { block, data } = node;
    const issue = data.issue;

    return [
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
