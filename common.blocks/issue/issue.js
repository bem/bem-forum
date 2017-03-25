modules.define('issue', ['i-bem-dom', 'jquery', 'button', 'modal', 'spin', 'functions'],
    function(provide, bemDom, $, Button, Modal, Spin, Functions) {

provide(bemDom.declBlock(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                var commentsElem = this.findChildElem('comments-button');
                var deleteElem = this.findChildElem('delete-button');

                commentsElem && this._events(commentsElem.findMixedBlock(Button)).on('click', this._onClickCommentsButton);
                if (deleteElem) {
                    var deleteYesButton = this.findChildElem('delete-modal-yes').findMixedBlock(Button),
                        deleteNoButton = this.findChildElem('delete-modal-no').findMixedBlock(Button);

                    this._events(deleteElem.findMixedBlock(Button)).on('click', this._onClickDeleteButton);

                    this._events(deleteYesButton).on('click', this._onConfirmDeleteButton);
                    this._events(deleteNoButton).on('click', this._onCancelDeleteButton);
                }
            }
        }
    },

    _onClickCommentsButton: function(event) {
        var button = event.bemTarget;

        event.preventDefault();
        $.get('/api/' + button.params.number + '/comments')
            .then(function(data) {
                bemDom.replace(button.domElem, data);
            });
    },

    _onClickDeleteButton: function(event) {
        var modal = this._elem('delete-confirm-modal').findMixedBlock(Modal);

        event.preventDefault();
        modal.setMod('visible', true);
    },

    _onCancelDeleteButton: function(event) {
        var modal = this._elem('delete-confirm-modal').findMixedBlock(Modal);

        event.preventDefault();
        modal.delMod('visible');
    },

    _onConfirmDeleteButton: function(event) {
        var modal = this._elem('delete-confirm-modal'),
            modalBody = modal._elem('delete-modal-body'),
            spinner = modal.findChildBlock(Spin);

        event.preventDefault();

        spinner.setMod('visible', true);
        modalBody.delMod('visible');

        $.post('/api/' + event.bemTarget.params.number + '/delete', {
            token: '213123123'
        }).then(function(response) {
            if (response === 'ok') {
                window.document.location.href = '/';
            }
        }).catch(function(){
            spinner.delMod('visible');
            modalBody.setMod('visible', true);
        });
    }
}, {
    lazyInit: true,

    onInit: function() {
        this._events(Button).on({ modName: 'js', modVal: 'inited' }, Functions.noop);
    }
}));

});
