modules.define('content', ['i-bem__dom'], function(provide, BEMDOM) {
    provide(BEMDOM.decl(this.name, {
        onSetMod: {
            js: {
                'inited': function() {
                    var selectSort = this.findBlockInside('sorting');
                    this._spinBlock = this.findBlockInside(this.elem('spin'), 'spin');
                    this._issuesBlock = this.findBlockInside('issues');

                    selectSort.on('issuesLoading', this._onIssuesLoading, this);
                    selectSort.on('issuesLoaded', this._onIssuesLoaded, this);
                }
            }
        },
        _onIssuesLoading: function() {
            this._spinBlock.setMod('visible');
            this._issuesBlock.setMod('loading');
        },
        _onIssuesLoaded: function(e, data) {
            BEMDOM.replace(this._issuesBlock.domElem, data);

            this._issuesBlock = this.findBlockInside('issues');

            this._spinBlock.delMod('visible');
            this._issuesBlock.delMod('loading');
        }
    }));
});
