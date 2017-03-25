block('issue').elem('toggle-resolved').content()(function() {
    var issue = this.ctx.issue;

    return {
        block: 'button',
        mods: { theme: 'islands', size: 's', view: 'plain' },
        js: issue,
        title: 'Переключить между решено и не решено', // TODO: придумать что получше
        icon: {
            block: 'icon',
            mods: { bg: issue.state === 'closed' ? 'question-circle' : 'check-circle' }
        }
    };
});
