modules.define(
    'labels-list__label',
    ['i-bem-dom', 'location', 'link', 'labels-list'],
    function(provide, bemDom, Location, Link, LabelsList) {

    var Label = bemDom.declElem('labels-list', 'label', {
        onSetMod: {
            js: {
                inited: function() {
                    this._link = this.findChildBlock(Link);

                    this._events(this._link).on('click', this._onLabelClick);
                }
            }
        },

        _onLabelClick: function(e) {
            e.preventDefault();

            if (this._link.hasMod('active')) {
                this._link.delMod('active');
                this._link.domElem[0].style['background-color'] = this._link.params.usualColor;

                Location.change({});
            } else {
                // Remove all active states from labels
                var activeLabels = this.findParentBlock(LabelsList).findChildBlocks({ block: Link, modName: 'active', modVal: true });
                activeLabels.delMod('active');
                activeLabels.forEach(function(label) {
                    label.domElem[0].style['background-color'] = label.params.usualColor;
                });

                this._link.setMod('active');
                this._link.domElem[0].style['background-color'] = this._link.params.activeColor;

                Location.change({ params: { labels: this._link.params.label } });
            }
        }
    });

    provide(Label);
});
