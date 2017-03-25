({
    mustDeps: 'i-bem-dom',
    shouldDeps: [
        { elem: ['toggle-resolved', 'actions'] },
        'functions',
        'user',
        'link',
        'api-request',
        {
            block: 'icon',
            mods: { bg: ['check-circle', 'question-circle'] }
        },
        {
            block: 'button',
            mods: { theme: 'islands', size: 'm' }
        },
        'comments'
    ]
})
