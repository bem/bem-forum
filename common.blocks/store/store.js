modules.define('store', ['i-bem-dom'], function(provide, bemDom) {
    var Store = bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    this.__self._data = this.params.storeData || {};
                }
            }
        }
    }, {
        getData: function() {
            return this._data;
        }
    });

    provide(Store);
});
