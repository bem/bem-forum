block('page-issue').content()(function() {
    var issue = this.data.issue;

    return issue ? {
        block: 'issue',
        mods: { state: issue.state, counts: true },
        issue: issue
    } : '';
});
