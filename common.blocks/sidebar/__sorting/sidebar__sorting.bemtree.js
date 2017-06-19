block('sidebar').elem('sorting').content()(function() {
    const { block } = this;
    const i18n = this.require('i18n');

    return [
        {
            block,
            elem: 'header',
            content: i18n(block, 'sorting')
        },
        {
            block: 'select',
            mods: { mode: 'radio', theme: 'islands', size: 'm', width: 'available' },
            mix: { block, elem: 'select' },
            name: 'sorting',
            val: 'updated',
            options: [
                { val: 'created', text: i18n(block, 'newest') },
                { val: 'created-reverse', text: i18n(block, 'oldest') },
                { val: 'comments', text: i18n(block, 'most_commented') },
                { val: 'comments-reverse', text: i18n(block, 'least_commented') },
                { val: 'updated', text: i18n(block, 'updated') },
                { val: 'updated-reverse', text: i18n(block, 'least_updated') }
            ]
        }
    ];
});
