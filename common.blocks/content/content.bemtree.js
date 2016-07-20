block('content').content()(function() {
  return [{
    block: 'content',
    elem: 'left',
    content: this.data.issues && this.data.issues.length ? { block: 'issues' } : ''
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
