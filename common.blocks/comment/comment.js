modules.define('comment', ['i-bem-dom', 'button', 'editing', 'api-request'],
    function(provide, bemDom, Button, editing, request) {

        provide(bemDom.declBlock(this.name, {
            onSetMod: {
                js: {
                    inited: function() {
                        this._editButton = this._elem('edit-button') && this._elem('edit-button').findMixedBlock(Button);
                        this._removeButton = this._elem('remove-button') && this._elem('remove-button').findMixedBlock(Button);

                        this._events(this._editButton).on('click', this._onClickEditButton);
                        this._events(this._removeButton).on('click', this._onClickRemoveButton);
                    }
                }
            },

            _onClickEditButton: function() {
                this.findMixedBlock(editing).setMod('state', 'editing');
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
            _onUpdateCommentCompleated: function(e, data) {
                this._elem('content').domElem.html(data.rawBody);
            },
            _onGetForm: function(e, formHtml) {
                bemDom.append(this._elem('user').domElem, formHtml);
            }

        }, {
                lazyInit: false,

                onInit: function() {
                    this._events(editing)
                        .on('updateComment', this.prototype._onUpdateCommentCompleated)
                        .on('insertCommentForm', this.prototype._onGetForm);
                }
            }));
    });
