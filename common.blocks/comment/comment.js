modules.define('comment', ['i-bem-dom', 'button', 'editing'],
    function(provide, bemDom, Button, editing) {

        provide(bemDom.declBlock(this.name, {
            onSetMod: {
                js: {
                    inited: function() {
                        this._editButton = this._elem('edit-button') && this._elem('edit-button').findMixedBlock(Button);

                        this._events(this._editButton).on('click', this._onClickEditButton);
                    }
                }
            },

            _onClickEditButton: function() {
                this.findMixedBlock(editing).setMod('state', 'editing');
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
