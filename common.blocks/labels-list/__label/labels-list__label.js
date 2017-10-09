modules.define('labels-list__label', [
    'i-bem-dom', 'location', 'link'
], function(provide, bemDom, Location, Link) {
    var Label = bemDom.declElem('labels-list', 'label', {
        onSetMod: {
            active: function(modName, modVal) {
                var link = this.findChildBlock(Link);

                link.domElem[0].style['background-color'] = link.params[modVal ? 'activeColor' : 'usualColor'];
            }
        },

        _onLabelClick: function(event) {
            event.preventDefault();

            this.toggleMod('active');

            var queryLabels = Location.getUri().queryParams.labels;
            var activeLabels = (queryLabels && queryLabels[0]) ? queryLabels[0].split(',') : [];

            var labelName = this.params.name;

            activeLabels.indexOf(labelName) === -1 ?
                activeLabels.push(labelName) :
                activeLabels.splice(activeLabels.indexOf(labelName), 1);

            Location.change(
                activeLabels.length ?
                    { params: { labels: activeLabels.join(','), state: 'all', page: '1' } } :
                    {}
            );
        }
    }, {
        lazyInit: true,

        onInit: function() {
            this._events(Link).on('click', this.prototype._onLabelClick);
        }
    });

    provide(Label);
});
