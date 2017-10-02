block('reaction')(
    js()(true),

    content()(node => {
        const { block, ctx } = node,
            reactions = ctx['reactions'];

        return  [
            {
                block: 'button',
                mix: { block, elem: 'up' },
                js: {
                    type: 'up'
                },
                content: reactions['+1'] > 0 ? '+' + reactions['+1'] : 0
            },
            {
                block: 'button',
                mix: { block, elem: 'down' },
                js: {
                    type: 'down'
                },
                content: reactions['-1'] > 0 ? '-' + reactions['-1'] : 0
            }
        ];
    })
);
