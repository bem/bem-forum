block('add-form')(
    content()(node => {
        const { block, i18n } = node;

        return [
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
                    }
                }
            },
            {
                block: block,
                elem: 'actions',
                content: [
                    {
                        block: 'button',
                        mix: { block: block, elem: 'submit-btn', js: true },
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
