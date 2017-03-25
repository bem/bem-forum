({
    mustDeps: 'i-bem-dom',
    shouldDeps: [
        'functions',
        'user',
        'link',
        {
            block: 'button',
            mods: { theme: 'islands', size: 'm', type: 'link', view: 'pseudo' }
        },
        {
            block: 'modal',
            mods: { theme: 'islands', visible: [true, false], autoclosable: true }
        },
        {
            block: 'spin',
            mods: { theme: 'islands', size: 'm', visible: [true, false] }
        },
        'comments'
    ]
})
