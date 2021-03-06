modules.define('send-form__submit-btn', ['i-bem-dom', 'button'], function(provide, bemDom, Button) {

    var SubmitBtn = bemDom.declElem('send-form', 'submit-btn', {
        _onButtonClick: function() {
            this._emit('submit');
        }
    }, {
        lazyInit: true,
        onInit: function() {
            this._events(Button).on('click', this.prototype._onButtonClick);
        }
    });

    provide(SubmitBtn);

});
