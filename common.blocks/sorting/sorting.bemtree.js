block('sorting').content()(function() {
    return [
    {
      elem: 'title',
      content: 'Sort'
    },
    {
      block : 'select',
      mix: { block: 'sorting', elem: 'select'},
      mods : { mode : 'radio', theme : 'islands', size : 'm', width: 'available' },
      name : 'select1',
      val : 0,
      options : [
          { val : 0, text : 'Newest' },
          { val : 1, text : 'Oldest' },
          { val : 2, text : 'Most commented' },
          { val : 3, text : 'Least commented' },
          { val : 4, text:  'Recently updated' },
          { val : 5, text:  'Least recently updated' }
      ]
    }]
  })
