modules.define('alert', ['i-bem-dom'], function(provide, bemDom) {
    var Alert = bemDom.declBlock('alert', {
        setText: function(text) {
            this._elem('text').domElem.text(String(text));

            return this;
        }
    });

    provide(Alert);
});
