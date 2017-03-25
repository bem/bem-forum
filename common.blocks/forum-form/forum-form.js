modules.define('forum-form', ['i-bem__dom', 'jquery'],
    function(provide, BEMDOM, $) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                var textarea = this.findBlockInside('textarea'),
                    plainTextButton = this.findBlocksInside('button')[0],
                    previewButton = this.findBlocksInside('button')[1];
                    
                textarea.bindTo('keyup', function() {
                    $('.textarea').val() ? previewButton.delMod('disabled') : previewButton.setMod('disabled');
                });

                previewButton.bindTo('click', function(){
                    if( $('.textarea').val() ){
                        $.post('/comment-preview', { data : $('.textarea').val() })
                            .then(function(data) {
                                $('.textarea').removeClass('forum-form__view_visible');
                                $('.forum-form__preview').addClass('forum-form__view_visible').html(data);
                            });
                    }
                });

                plainTextButton.bindTo('click', function(){   
                    $('.textarea').addClass('forum-form__view_visible');
                    $('.forum-form__preview').removeClass('forum-form__view_visible');
                });
            }
        }
    }
}));

});
