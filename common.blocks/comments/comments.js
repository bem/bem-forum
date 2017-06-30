modules.define('comments', [
    'i-bem-dom', 'BEMHTML', 'add-form', 'api-request'
], function(provide, bemDom, BEMHTML, AddForm, request) {
    var Comments = bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    if (this.params.user) {
                        this._form = this._elem('add-comment-form').findMixedBlock(AddForm);
                    }
                }
            }
        },

        /**
         * @param {events.Event} event - событие
         * @param {Object} commentData - данные о комментарии
         * @param {string} commentData.text - текст комментария
         */
        _onSubmitForm: function(event, commentData) {
            this._form.setMod('loading');
            request.post(`${this.params.issueId}/comments`, { text: commentData.text })
                .then(function() {
                    bemDom.append(this._elem('list').domElem, BEMHTML.apply({
                        block: 'comment',
                        user: Object.assign({ html_url: 'https://github.com/' + this.params.user.login }, this.params.user),
                        created_from_now: 'Только что', // TODO: i18n
                        html: this._form.getRenderedContent()
                    }));
                    this._form
                        .delMod('loading')
                        .clear();
                }.bind(this))
                .catch(function() {
                    this._form.showErrorMessage('Что-то пошло не так :(').delMod('loading');
                }.bind(this));
        },

        _onEmptyData: function() {
            this._form.showErrorMessage('Сначала нужно написать что-нибудь');
        }
    }, {
        lazyInit: true,

        onInit: function() {
            this._events(AddForm)
                .on('submit', this.prototype._onSubmitForm)
                .on('empty-data', this.prototype._onEmptyData);
        }
    });

    provide(Comments);
});
