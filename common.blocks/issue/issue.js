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
                            function(res) {
                                issue._onUpdatedIssueState();
                                BEMDOM.replace(issues.domElem, res);
                            },
                            function(err) {
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
        this.findBlockInside(this.elem('loader'), 'spin').setMod('visible');
    },
    _onUpdatedIssueState: function () {
        this.delMod('progress');
        this.findBlockInside(this.elem('loader'), 'spin').delMod('visible');
    }
}));

});
