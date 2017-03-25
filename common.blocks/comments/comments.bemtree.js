block('comments').content()(function() {
    var comments = this.data.comments;

    return [
        comments.map(function(comment) {
            return {
                block: 'comment',
                comment: comment
            };
        }),
        {
            elem: 'add-form',
            content: {
                block: 'forum-form'
            }
        }
    ]
});
