block('sidebar').elem('labels').replace()(function() {
    const { block, data } = this;
    const i18n = this.require('i18n');

    return {
        block: 'labels',
        mix: { block, elem: 'labels' },
        content: [
            {
                block,
                elem: 'header',
                content: i18n(block, 'labels')
            },
            { block: 'labels-list', labels: data.labels }
        ]
    };
});
