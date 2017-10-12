modules.define('comments', [
    'i-bem-dom', 'BEMHTML', 'editing', 'syntax-highlighter'
], function(provide, bemDom, BEMHTML, editing, SyntaxHighlighter) {
    var Comments = bemDom.declBlock(this.name, {
        _onAddComment: function(event, data) {
            bemDom.append(this._elem('list').domElem, BEMHTML.apply({
                block: 'comment',
                mix: [
                    { block: 'comments', elem: 'comment' },
                    {
                        block: 'editing',
                        js: {
                            formType: 'comment',
                            entityId: data.commentId
                        }
                    }
                ],
                user: Object.assign({ html_url: 'https://github.com/' + this.params.user.login }, this.params.user),
                created_from_now: 'Только что', // TODO: i18n
                html: SyntaxHighlighter.highlight(data.html),
                js: {
                    commentId: data.commentId
                }
            }));
        }
    }, {
        lazyInit: true,

        onInit: function() {
            this._events(editing)
                .on('addComment', this.prototype._onAddComment);
        }
    });

    provide(Comments);
});
