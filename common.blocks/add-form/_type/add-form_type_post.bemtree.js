block('add-form').mod('type', 'post').elem('fields').content()(node => {
    const { block, i18n } = node;

    return [{
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
        placeholder: i18n(block, 'postTitle')
    }].concat(applyNext());
});
