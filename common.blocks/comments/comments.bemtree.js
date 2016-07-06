block('comments').content()(function() {
    return this.data.comments.map(function(comment) {
        return {
            block: 'comment',
            comment: comment
        };
    });
});