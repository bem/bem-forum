block('error-board').content()(function() {
    var block = this.block,
        i18n = this.require('i18n');

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
                        i18n(this.block, 'youCanGo'),
                        {
                            block: 'link',
                            url: '/',
                            content: i18n(this.block, 'homePage')
                        }
                    ]
                }
            ]
        },
        {
            elem: 'title-issues',
            content: i18n(this.block, 'latestIssues')
        },
        {
            block: 'issues'
        }
    ]
});
