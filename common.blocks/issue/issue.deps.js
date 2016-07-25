({
    shouldDeps: [
        'user',
        'link',
        {
            block: 'button',
            mods: { theme: 'islands', size: 'm', type: 'link', view: 'pseudo' }
        },
        {
            block: 'spin',
            mods: {
                theme: 'islands',
                size: 'xl',
                visible: false
            }
        },
        'comments'
    ]
})
