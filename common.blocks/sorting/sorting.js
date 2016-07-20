modules.define('sorting', ['i-bem__dom', 'select'], function(provide, BEMDOM, Select) {
    provide(BEMDOM.decl(this.name, {
        onSetMod: {
            js: {
                'inited': function() {
                    Select.on(this.elem('select'), 'change', this._onSortingSelectChanged, this);
                }
            }
        },
        _onSortingSelectChanged: function(e) {
            console.log('val', e.target.getVal() );
        }
    }))
});
