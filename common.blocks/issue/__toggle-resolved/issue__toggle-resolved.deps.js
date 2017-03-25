({
    mustDeps: ['i-bem-dom'],
    shouldDeps: [
        'api-request',
        { 
            block: 'icon',
            mods: { bg: ['check-circle', 'question-circle'] }
        },
        {
            block: 'button',
            mods: { theme: 'islands', size: 's', view: 'plain' }
        }
    ]
});
