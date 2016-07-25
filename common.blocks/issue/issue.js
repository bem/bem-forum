modules.define('issue', ['i-bem__dom', 'jquery', 'button'],
    function(provide, BEMDOM, $) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                var issue = this,
                    issues = this.findBlockOutside('issues'),
                    commentsButton = this.findBlockInside('comments-button', 'button'),
                    closeIssueButton = this.findBlockInside('close-button', 'button');

                this._spinner = this.findBlockInside(this.elem('loader'), 'spin');

                commentsButton && commentsButton.bindTo('click', function(e) {
                    e.preventDefault();

                    $.get('/api/' + commentsButton.params.number + '/comments')
                        .then(function(data) {
                            BEMDOM.replace(commentsButton.domElem, data);
                        });
                });

                closeIssueButton && closeIssueButton.bindTo('click', function(e) {
                    e.preventDefault();
                    issue._onUpdatingIssueState();

                    $.get(closeIssueButton.domElem[0].attributes.href.value)
                        .then(
                            function(response) {
                                issue._onUpdatedIssueState();
                                BEMDOM.replace(issues.domElem, response);
                            },
                            function() {
                                issue._onUpdatedIssueState();
                                alert('Oops, error!');
                            }
                        );
                });
            }
        }
    },
    _onUpdatingIssueState: function () {
        this.setMod('progress');
        this._spinner.setMod('visible');
    },
    _onUpdatedIssueState: function () {
        this.delMod('progress');
        this._spinner.delMod('visible');
    }
}));

});
