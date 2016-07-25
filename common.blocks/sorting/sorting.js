modules.define('sorting', ['i-bem__dom', 'select', 'jquery'], function(provide, BEMDOM, Select, $) {
    provide(BEMDOM.decl(this.name, {
        onSetMod: {
            js: {
                'inited': function() {
                    Select.on(this.elem('select'), 'change', this._onSortingSelectChanged, this);
                }
            }
        },
        _onSortingSelectChanged: function(e) {
            var queryString = e.target.getVal();

            this.emit('issuesLoading');

            $.get('/?' + queryString)
            .then((function(data) {
                this.emit('issuesLoaded', data);
            }).bind(this));
        }
    }));
});
