block('comment').content()((node, ctx) => {
    const { block } = node;

    return [
        {
            elem: 'date',
            content: ctx.created_from_now
        },
        {
            block: 'user',
            mix: { block, elem: 'user' },
            user: ctx.user
        },
        {
            elem: 'content',
            mix: { block: 'md-body' },
            content: ctx.html
        }
    ];
});
