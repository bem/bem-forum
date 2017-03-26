modules.define('issue', ['i-bem-dom', 'jquery', 'button', 'functions', 'api-request'],
    function(provide, bemDom, $, Button, Functions, request) {

provide(bemDom.declBlock(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                var commentsButton = this.findChildElem('comments-button').findMixedBlock(Button);

                this._events(commentsButton).on('click', this._onClickCommentsButton);
            }
        }
    },

    _onClickCommentsButton: function(event) {
        var button = event.bemTarget;

        event.preventDefault();

        request(button.params.number + '/comments')
            .then(function(response) { return response.text(); })
            .then(function(data) {
                bemDom.replace(button.domElem, data);
            });
    }
}, {
    lazyInit: true,

    onInit: function() {
        this._events(Button).on({ modName: 'js', modVal: 'inited' }, Functions.noop);
    }
}));

});
