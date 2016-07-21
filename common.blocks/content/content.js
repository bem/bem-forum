modules.define('content', ['i-bem__dom'], function(provide, BEMDOM) {
    provide(BEMDOM.decl(this.name, {
        onSetMod: {
            js: {
                'inited': function() {
                    var selectSort = this.findBlockInside('sorting');

                    selectSort.on('issuesLoading', this._onIssuesLoading, this);
                    selectSort.on('issuesLoaded', this._onIssuesLoaded, this);
                }
            }
        },
        _onIssuesLoading: function() {
            var spinBlock = this.findBlockInside(this.elem('spin'), 'spin');
            var issuesBlock = this.findBlockInside('issues');

            spinBlock.setMod('visible');
            issuesBlock.setMod('loading');
        },
        _onIssuesLoaded: function(e, data) {
            var spinBlock = this.findBlockInside(this.elem('spin'), 'spin');
            var issuesBlock = this.findBlockInside('issues');

            BEMDOM.replace(issuesBlock.domElem, data);

            spinBlock.delMod('visible');
            issuesBlock.delMod('loading');
        }
    }))
});
