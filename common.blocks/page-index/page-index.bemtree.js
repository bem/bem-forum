block('page-index').content()(function() {
    var data = this.data,
        issues = data.issues;

    return [
        issues && issues.length ? {
            block: 'issues'
        } : ''
    ];
});
