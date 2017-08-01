modules.define('issues', ['i-bem-dom', 'sidebar', 'api-request', 'location'], function(provide, bemDom, Sidebar, request, Location) {
    provide(bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    Location.on('change', this._onSorting, this);
                }
            }
        },

        _onSorting: function() {
            request('issues', { query: Location.getUri().queryParams })
                .then(function(data) { bemDom.replace(this.domElem, data); }.bind(this));
        }
    }));
});
