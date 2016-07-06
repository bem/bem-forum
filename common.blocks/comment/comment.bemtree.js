block('comment').content()(function() {
    var comment = this.ctx.comment;

    return [
        {
            block: 'user',
            user: comment.user
        },
        {
            elem: 'date',
            content: comment.created_from_now
        },
        comment.html
    ];
});