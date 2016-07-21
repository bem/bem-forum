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
      var queryString = this._getQueryString(e.target.getVal()),
      contentBlock = this.findBlockOutside('content'),
      contentLeftSpinBlock = contentBlock.findBlockInside('content__spin').findBlockOn('spin'),
      issuesBlock = contentBlock.findBlockInside('issues');

      issuesBlock.setMod('loading');
      contentLeftSpinBlock.setMod('visible');

      $.get(`/?${queryString}`)
      .then(function(data) {
        issuesBlock.delMod('loading');
        BEMDOM.replace(issuesBlock.domElem, data);
        contentLeftSpinBlock.delMod('visible');
      });
    },
    _getQueryString: function(val) {
      switch (val) {
        case 0: return 'sort=created&direction=desc';
        case 1: return 'sort=created&direction=asc';
        case 2: return 'sort=comments&direction=desc';
        case 3: return 'sort=comments&direction=asc';
        case 4: return 'sort=updated&direction=desc';
        case 5: return 'sort=updated&direction=asc';
        default: return '';
      }
    }
  }))
});
