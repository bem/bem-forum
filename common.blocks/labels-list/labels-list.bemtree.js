block('labels-list').content()(function() {
    return this.ctx.labels.map(label => ({
        block: this.block,
        elem: 'label',
        name: label.name,
        color: label.color
    }));
});
