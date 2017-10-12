modules.define('comment', [
    'i-bem-dom', 'button', 'editing', 'api-request', 'syntax-highlighter'
], function(provide, bemDom, Button, Editing, request, SyntaxHighlighter) {
    provide(bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    this._elem('content').domElem.html(
                        SyntaxHighlighter.highlight(this._elem('content').domElem.html())
                    );

                    this._editButton = this._elem('edit-button') && this._elem('edit-button').findMixedBlock(Button);
                    this._removeButton = this._elem('remove-button') && this._elem('remove-button').findMixedBlock(Button);

                    this._events(this._editButton).on('click', this._onClickEditButton);
                    this._events(this._removeButton).on('click', this._onClickRemoveButton);
                }
            }
        },

        _onClickEditButton: function() {
            this.findMixedBlock(Editing).setMod('state', 'editing');
        },
        _onClickRemoveButton: function() {
            this._removeButton.setMod('disabled');
            request.delete('issues/comments/' + this.params.commentId)
                .then(function() {
                    bemDom.destruct(this.domElem);
                }.bind(this))
                .catch(function() {
                    this._removeButton.delMod('disabled');
                }.bind(this));
        },
        _onUpdateCommentCompleted: function(e, data) {
            this._elem('content').domElem.html(SyntaxHighlighter.highlight(data.rawBody));
        },
        _onGetForm: function(e, formHtml) {
            bemDom.append(this._elem('user').domElem, formHtml);
        }

    }, {
        lazyInit: false,

        onInit: function() {
            this._events(Editing)
                .on('updateComment', this.prototype._onUpdateCommentCompleted)
                .on('insertCommentForm', this.prototype._onGetForm);
        }
    }));
});
