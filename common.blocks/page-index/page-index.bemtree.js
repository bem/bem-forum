block('page-index').content()(function() {
    const { block, data } = this;

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
