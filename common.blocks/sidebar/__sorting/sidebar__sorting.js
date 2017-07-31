modules.define(
    'sidebar__sorting',
    ['i-bem-dom', 'select', 'location'],
    function(provide, bemDom, Select, Location) {

    var Sorting = bemDom.declElem('sidebar', 'sorting', {
        onSetMod: {
            js: {
                inited: function() {
                    this._select = this.findChildBlock(Select);
                }
            }
        },

        _onSelectChange: function() {
            var sortType = this._select.getVal();
            var direction = 'desc';

            if (sortType.indexOf('-reverse') !== -1) {
                sortType = sortType.split('-')[0];
                direction = 'asc';
            }

            var params =  this._getParams(sortType, direction);
            delete params.page;

            Location.change({ params: params });
            window.location.reload();
        },

        _getParams: function(sort, direction) {
            return Object.assign(
                Location.getUri().queryParams,
                { sort, direction }
            );
        }

    }, {
        lazyInit: true,

        onInit() {
            this._events(Select).on('change', this.prototype._onSelectChange);
        }
    });

    provide(Sorting);
});
