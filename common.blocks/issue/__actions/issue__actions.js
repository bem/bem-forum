modules.define('issue__actions', ['i-bem-dom', 'spin', 'functions'], function(provide, bemDom, Spin, functions) {

    var Actions = bemDom.declElem('issue', 'actions', {
        onSetMod: {
            loading: function(modName, modVal) {
                this.findChildBlock(Spin).setMod('visible', modVal);
            }
        }
    }, {
        lazyInit: true,

        onInit: function() {
            this._events().on('click', functions.noop);
        }
    });

    provide(Actions);

});
