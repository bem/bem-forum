modules.define('issue', ['i-bem-dom', 'jquery', 'button', 'functions', 'api-request'],
    function(provide, bemDom, $, Button, Functions, request) {

provide(bemDom.declBlock(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                var toggleResolved = this._elem('toggle-resolved');
                var commentsButton = this._elem('comments-button') && this._elem('comments-button').findMixedBlock(Button);

                this._events(toggleResolved)
                    .on('toggle-resolved-loading', this._onToggleResolvedLoading)
                    .on('toggle-resolved-fail', this._onToggleResolvedFail)
                    .on('toggle-resolved-success', this._onToggleResolvedSuccess);

                this._events(commentsButton).on('click', this._onClickCommentsButton);
            }
        }
    },

    _onToggleResolvedLoading: function() {
        this._elem('actions').setMod('loading');
    },

    _onToggleResolvedFail: function() {
        this._elem('actions').delMod('loading');
    },

    _onToggleResolvedSuccess: function() {
        this._elem('actions').delMod('loading');
        this.toggleMod('state', 'closed', 'open');
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
