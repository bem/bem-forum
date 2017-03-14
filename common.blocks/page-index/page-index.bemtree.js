block('page-index').content()(function() {
    var issues = this.data.issues;

    return issues && issues.length ? {
        block: 'issues'
    } : '';
});
