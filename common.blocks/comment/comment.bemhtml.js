block('comment')(
    js()(true),

    content()(node => {
        const { block, ctx } = node;
        return [
            ctx.userProfileId === ctx.user.id && [
                {
                    block: 'button',
                    mix: { block, elem: 'edit-button' },
                    text: 'edit'
                },
                {
                    block: 'button',
                    mix: { block, elem: 'remove-button' },
                    text: 'remove'
                }
            ],
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
