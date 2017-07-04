modules.define('editing', [
    'i-bem-dom', 'api-request', 'send-form'
], function(provide, bemDom, request, SendForm) {

    const Editing = bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    this.settings = {
                        id: this.params.entityId,
                        formType: this.params.formType
                    };
                }
            },
            state: {
                editing: function() {
                    var id = this.settings.id;
                    var formType = this.settings.formType;

                    this.sendForm ?
                        this._setEditFormData(id) :
                        request(this.params.apiUrls[this.settings.formType].get + id + '?type=form')
                            .then(function(formHtml) {
                                this.setMod('state', 'opened');

                                this._emit(formType === 'issue' ? 'insertIssueForm' : 'insertCommentForm', formHtml);

                                this.sendForm = this.findChildBlock(SendForm);
                            }.bind(this));
                }
            }
        },
        _getDefaultParams: function() {
            return {
                apiUrls: {
                    issue: {
                        get: 'form/',
                        edit: ''
                    },
                    comment: {
                        get: 'issues/comments/',
                        edit: 'issues/comments/'
                    }
                }
            };
        },
        _setEditFormData: function(id) {
            request(this.params.apiUrls[this.settings.formType].get + id + '?type=data')
                .then(function(response) { return JSON.parse(response); })
                .then(function(issue) {
                    this.setMod('state', 'opened');

                    this.sendForm.fillForm(issue);
                }.bind(this));
        },

        _onFormSubmit: function(e, data) {
            data.reqType == 'edit' ? this._onEditForm(e, data) : this._onPostForm(e, data);
        },

        _onEditForm: function(e, data) {
            var formType = this.settings.formType;

            this.sendForm.setMod('loading');

            request.patch(this.params.apiUrls[formType].edit + this.settings.id, {
                body: data.body,
                title: data.titleå
            })
                .then(function() {
                    this.sendForm.delMod('loading');
                    this.delMod('state');

                    this._emit(formType === 'issue' ? 'updateIssue' : 'updateComment', data);
                }.bind(this))
                .catch(function() {
                    this.sendForm.delMod('loading');
                    this.sendForm.showErrorMessage('The' + formType + ' was not changed');
                });
        },

        _onPostForm: function(e, data) {
            this.sendForm = this.findChildBlock(SendForm).setMod('loading');

            var isIssue = this.settings.formType === 'issue';

            var postUrl = isIssue ? 'create' : this.settings.id + '/comments';
            var postData = isIssue ? data : { text: data.body };

            request.post(postUrl, postData)
                .then(function(response) { return JSON.parse(response); })
                .then(function(res) {
                    isIssue ?
                        window.location = '/' + res.number :
                        this._emit('addComment', { commentId: res, html: data.rawBody });

                    this.sendForm.delMod('loading').clear();
                }.bind(this))
                .catch(function() {
                    this._form.showErrorMessage('Что-то пошло не так :(').delMod('loading');
                }.bind(this));
        }
    },
        {
            lazyInit: true,
            onInit: function() {
                this._events(SendForm).on('submit', this.prototype._onFormSubmit);
            }
        });

    provide(Editing);
});
