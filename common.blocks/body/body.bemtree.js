block('body').content()(function() {
    return this.data.issues && this.data.issues.length ? {
        block: 'issues'
    } : '';
});
