block('page-post').content()(function() {
    const issue = this.data.issue;

    return {
        block: 'issue',
        mods: { state: issue.state },
        issue
    };
});
