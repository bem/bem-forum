block('page-index').content()(function() {
    var data = this.data,
        issues = data.issues,
        pagination = data.pagination || {};

    return [
        issues && issues.length ? {
            block: 'issues'
        } : '',
        (pagination.next || pagination.prev) && {
            block: 'pager'
        }
    ];
});
