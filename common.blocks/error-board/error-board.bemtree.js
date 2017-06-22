block('error-board').content()(node => {
    const { block, i18n } = node;

    return [
        {
            elem: 'description',
            content: [
                {
                    elem: 'title',
                    content: i18n(block, 'pageNotFound')
                },
                {
                    elem: 'proposition',
                    content: [
                        i18n(block, 'youCanGo'),
                        {
                            block: 'link',
                            url: '/',
                            content: i18n(block, 'homePage')
                        }
                    ]
                }
            ]
        },
        {
            elem: 'title-issues',
            content: i18n(block, 'latestIssues')
        },
        {
            block: 'issues'
        }
    ];
});
