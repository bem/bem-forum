modules.define('comments', ['i-bem-dom', 'add-form', 'api-request'], function(provide, bemDom, AddForm, request) {
    var Comments = bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    this._form = this._elem('add-comment-form').findMixedBlock(AddForm);
                }
            }
        },

        _getRenderedComment: function(commentData) {
            return request(`comments/${commentData.id}`)
                .then(function(response) { return response.text(); });
        },

        /**
         * @param {events.Event} event - событие
         * @param {Object} commentData - данные о комментарии
         * @param {string} commentData.text - текст комментария
         */
        _onSubmitForm: function(event, commentData) {
            this._form.setMod('loading');
            request.post(`${this.params.issueId}/comments`, { text: commentData.text })
                .then(function(response) {
                    return response.json();
                })
                // ловим ошибку только здесь, потому что комментарий уже будет добавлен
                // и если вдруг мы просто неподгрузим новый и покажем ошибку ->
                // введем пользователя в заблуждение
                .catch(function() {
                    this._form.showErrorMessage('Что-то пошло не так').delMod('loading');
                }.bind(this))
                .then(function(response) {
                    this._form.showSuccessMessage('Комментарий успешно добавлен').delMod('loading');
                    return this._getRenderedComment(response);
                }.bind(this))
                .then(function(renderedComment) {
                    bemDom.append(this._elem('list').domElem, renderedComment);
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
