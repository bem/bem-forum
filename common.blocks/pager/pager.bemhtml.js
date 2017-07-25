block('pager')
.elem('item')
.match(function() { return this.ctx.url !== true; })
.replace()(function() {
    const type2caption = {
        first: '<<',
        prev: '<',
        current: 'V',
        next: '>',
        last: '>>'
    };

    const elemMods = this.elemMods;
    const type = elemMods.type;

    return {
        block: 'button',
        mods: { theme: 'islands', size: 'm', type: 'link', disabled: type === 'current' },
        mix: { block: this.block, elem: this.elem, elemMods },
        url: this.ctx.url,
        text: type2caption[type] || this.ctx.number
    };
});
