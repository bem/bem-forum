block('content').content()(function() {
  return [{
    block: 'content',
    elem: 'left',
    content: this.data.issues && this.data.issues.length ? [
    {
      block: 'content__loader',
      content: {
        block: 'spin',
        mix: { block: 'content', elem: 'spin' },
        mods: { theme: 'islands', size: 'xl', visible: false }
      }
    },
      { block: 'issues' }
    ] : ''
  },
  {
    block: 'content',
    elem: 'right',
    content: [{
      block: 'sorting',
      js: true
    }]
  }]
});
