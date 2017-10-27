block('root').replace()((node, ctx) => {
    const { block, i18n } = node;
    const data = node.data = ctx.data;
    const meta = data.meta || {};
    const og = meta.og || {};

    if (ctx.context) return ctx.context;

    return {
        block: 'page',
        title: data.title || i18n(block, 'title'), // БЭМ - Форум
        favicon: data.pathPrefix + '/favicon.ico',
        styles: [
            {
                elem: 'css',
                url: data.pathPrefix + '/index.min.css'
            }
        ],
        scripts: [
            {
                elem: 'js',
                url: data.pathPrefix + '/index.min.js'
            }
        ],
        head: [
            { elem: 'meta', attrs: { name: 'description', content: meta.description } },
            { elem: 'meta', attrs: { property: 'og:title', content: og.title || data.title } },
            { elem: 'meta', attrs: { property: 'og:url', content: og.url } },
            { elem: 'meta', attrs: { property: 'og:site_name', content: og.siteName } },
            { elem: 'meta', attrs: { property: 'og:locale', content: og.locale || 'en_US' } },
            { elem: 'meta', attrs: { property: 'og:type', content: 'website' } },
            { elem: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' } }
        ],
        mods: {
            theme: 'islands',
            view: data.view
        },
        mix: { block: 'store', js: { storeData: data.store } }
    };
});
