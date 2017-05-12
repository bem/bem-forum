block('add-form').mod('type', 'post').elem('fields').content()(node => {
    const block = node.block;

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
        placeholder: 'Заголовок поста'
    }].concat(applyNext());
});
