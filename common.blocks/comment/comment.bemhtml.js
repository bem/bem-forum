block('comment')(
    js()(true),
    content()((node, ctx) => {
        const { block } = node;

        return [
            {
                block: 'button',
                text: 'edit',
                mix: { block, elem: 'edit-button' }
            },
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
    })
);
