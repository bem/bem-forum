block('pager')
.elem('item')
.match(node => node.ctx.url !== true)
.replace()(node => {
    const type2caption = {
        first: '<<',
        prev: '<',
        current: 'V',
        next: '>',
        last: '>>'
    };

    const elemMods = node.elemMods;
    const type = elemMods.type;

    return {
        block: 'button',
        mods: { theme: 'islands', size: 'm', type: 'link', disabled: type === 'current' },
        mix: { block: node.block, elem: node.elem, elemMods },
        url: node.ctx.url,
        text: type2caption[type] || node.ctx.number
    };
});
