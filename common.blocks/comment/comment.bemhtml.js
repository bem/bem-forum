block('comment').content()(function() {
    var ctx = this.ctx;

    return [
        {
            block: 'user',
            user: ctx.user
        },
        {
            elem: 'date',
            content: ctx.created_from_now
        },
        {
            elem: 'content',
            content: ctx.html
        }
    ];
});
