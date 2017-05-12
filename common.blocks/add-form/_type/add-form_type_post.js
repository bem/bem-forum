modules.define('add-form', ['i-bem-dom', 'input'], function(provide, bemDom, Input, AddForm) {

    AddForm.declMod({ modName: 'type', modVal: 'post' }, {
        /* @override */
        _gatherData: function() {
            return Object.assign({
                title: this._elem('title').findMixedBlock(Input).getVal()
            }, this.__base.apply(this, arguments));
        }
    });

    provide(AddForm);

});
