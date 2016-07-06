block('issues').content()(function() {
    return this.data.issues.map(function(issue) {
        return {
            block: 'issue',
            mods: { state: issue.state },
            issue: issue
        };
    });
});
