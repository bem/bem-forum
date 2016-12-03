({
    mustDeps: [
        'service-worker'
    ],
    shouldDeps: [
        {
            mods: { view: ['404', '500'] }
        },
        'header',
        'body',
        'footer'
    ]
})
