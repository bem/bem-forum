block('comment').content()(function() {
    var comment = this.ctx.comment;

    return [
        {
            block: 'user',
            mix: { block: 'page', elem: 'link' },
            user: comment.user
        },
        {
            elem: 'date',
            content: comment.created_from_now
        },
        {
            elem: 'content',
            content: comment.html
        }
    ];
});
