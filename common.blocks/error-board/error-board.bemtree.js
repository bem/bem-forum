block('error-board').content()((node, ctx) => {
    const error = ctx.error;

    return [
        {
            elem: 'title',
            content: error.header
        },
        {
            elem: 'text',
            content: error.text
        }
    ];
});
