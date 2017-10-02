modules.define('comments', [
    'i-bem-dom', 'BEMHTML', 'editing'
], function(provide, bemDom, BEMHTML, editing) {
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
                html: data.html,
                js: {
                    commentId: data.commentId
                },
                reactions: {
                    '+1': 0,
                    '-1': 0
                },
                commentId: data.commentId
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
