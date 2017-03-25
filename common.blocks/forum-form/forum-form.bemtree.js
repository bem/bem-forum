block('forum-form').content()(function() {
    var i18n = this.require('i18n');

    return [
        {
            elem: 'forum-create',
            content: [
                {
                    elem: 'header',
                    content: {
                        block: 'radio-group',
                        mods: { theme: 'islands', size: 'm', type: 'button' },
                        name: 'radio-button',
                        val: 1,
                        options: [
                            { 
                                val: 1,
                                icon: {
                                    block: 'icon',
                                    mods: { view: 'markdown', size: '24' }
                                }
                            },
                            {
                                val: 2,
                                disabled: true,
                                icon: {
                                    block: 'icon',
                                    mods: { view: 'preview', size: '24' }
                                }
                            }
                        ]
                    }
                },
                {
                    elem: 'body',
                    content: [
                        {
                            block: 'textarea',
                            name: 'body',
                            mods: { theme: 'islands', size: 'l', width: 'available' },
                            mix: [{ block: 'forum-form', elem: 'view' }, { block: 'forum-form', elem: 'view_visible' }],
                            placeholder: i18n(this.block, 'leaveMessage')
                        },
                        {
                            elem: 'preview',
                            mix: { block: 'forum-form', elem: 'view' }
                        }
                    ]
                }
            ]
        },
        {
            elem: 'submit',
            content: {
                block: 'button',
                mods: { theme: 'islands', size: 'm', view: 'action' },
                text: i18n(this.block, 'comment')
            }
        }
    ]
});
