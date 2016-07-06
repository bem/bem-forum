modules.define('issue', ['i-bem__dom', 'jquery', 'button'],
    function(provide, BEMDOM, $, Button) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                var commentsButton = this.findBlockInside('comment-button', 'button');

                commentsButton.bindTo('click', function(e) {
                    e.preventDefault();

                    $.get('/api/' + commentsButton.params.number + '/comments')
                        .then(function(data) {
                            BEMDOM.replace(commentsButton.domElem, data);
                        });
                });
            }
        }
    }
}));

});