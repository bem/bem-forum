block('send-form')(
    content()(node => {
        const { block, i18n, ctx } = node;
        const data = ctx.issue || ctx.comment;

        return [
            ctx.formType === 'issue' ? {
                block: 'input',
                mix: [
                    { block: block, elem: 'title' },
                    { block: block, elem: 'field' }
                ],
                mods: {
                    theme: 'islands',
                    size: 'm',
                    width: 'available'
                },
                placeholder: i18n(block, 'postTitle'),
                val: data ? data.title : ''
            } : '',
            {
                block: 'alert',
                mods: { hidden: true },
                mix: { block: block, elem: 'alert' }
            },
            {
                elem: 'fields',
                content: {
                    block: 'editor',
                    mix: [
                        { block: block, elem: 'editor' },
                        { block: block, elem: 'field' }
                    ],
                    mods: {
                        theme: 'islands',
                        size: 'm',
                        mode: 'source',
                        renderer: 'marked',
                        width: 'available',
                        'has-actions': true,
                        'has-preview': true
                    },
                    val: data ? data.body : ''
                }
            },
            {
                block: block,
                elem: 'actions',
                content: [
                    {
                        block: 'button',
                        mix: {
                            block,
                            elem: 'submit-btn',
                            js: {
                                formType: ctx.formType,
                                reqType: ctx.reqType
                            }
                        },
                        mods: {
                            theme: 'islands',
                            size: 'm',
                            view: 'action'
                        },

                        text: i18n(block, 'send')
                    },
                    {
                        block: 'spin',
                        mix: { block: block, elem: 'spinner' },
                        mods: {
                            theme: 'islands',
                            size: 'm'
                        }
                    }
                ]
            }
        ];
    })
);
