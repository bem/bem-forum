block('sidebar').elem('labels').replace()(node => {
    const { block, data, i18n } = node;

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
