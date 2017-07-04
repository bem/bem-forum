modules.define('page-create-post', [
    'i-bem-dom', 'send-form'
], function(provide, bemDom, SendForm) {
    const PageCreatePost = bemDom.declBlock(this.name, {
        _onEmptyData: function() {
            this._getForm().showErrorMessage('Сначала нужно заполнить все поля');
        },

        _getForm: function() {
            return this._sendForm || (this._sendForm = this.findChildBlock(SendForm));
        }
    }, {
        lazyInit: true,
        onInit: function() {
            this._events(SendForm)
                .on('empty-data', this.prototype._onEmptyData);
        }
    });

    provide(PageCreatePost);
});
