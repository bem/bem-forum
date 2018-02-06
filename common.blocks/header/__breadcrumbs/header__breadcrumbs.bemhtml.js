block('header')(
    elem('breadcrumbs').content()((node, ctx) => {
        const items = ctx.items;

        if (!Array.isArray(items)) return;

        return items.filter(Boolean).map((item, idx) => {
            return item.url && idx < items.length - 1 ?
            {
                block: 'link',
                mix: [
                    { block: 'header', elem: 'breadcrumb' },
                    { block: 'header', elem: 'breadcrumb-link' }
                ],
                url: item.url,
                content: item.text
            } :
            {
                elem: 'breadcrumb',
                content: item.text
            };
        });
    }),

    elem('breadcrumb').tag()('span'),
    elem('breadcrumb-separator').tag()('span')
);
