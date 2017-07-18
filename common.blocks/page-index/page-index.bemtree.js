block('page-index').content()(node => {
    const { block, data } = node;

    return [
        {
            elem: 'content',
            content: {
                block: 'issues',
                user: data.userLogin
            }
        },
        {
            block: 'sidebar',
            mix: { block, elem: 'sidebar' }
        }
    ];
});
