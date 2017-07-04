([
    {
    mustDeps: ['i-bem-dom', 'i18n'],
    shouldDeps: [
        'form',
        { elem: 'submit-btn' },
        {
            block: 'alert',
            mods: { type: ['error', 'success'], hidden: true }
        },
        {
            block: 'editor',
            mods: {
                theme: 'islands',
                size: 'm',
                disabled: true,
                mode: 'source',
                renderer: 'marked',
                width: 'available',
                'has-actions': true,
                'has-preview': true
            }
        },
        {
            block: 'button',
            mods: {
                theme: 'islands',
                view: 'action',
                size: 'm',
                disabled: true
            }
        },
        {
            block: 'spin',
            mods: {
                theme: 'islands',
                size: 'm',
                visible: true
            }
        },
        {
            block: 'input',
            mods: {
                theme: 'islands',
                size: 'm',
                width: 'available'
            }
        }
    ]
},
{
    tech: 'js',
    mustDeps: [
        { tech: 'i18n' },
        { tech: 'i18n', block: 'i18n' }
    ]
}]);
