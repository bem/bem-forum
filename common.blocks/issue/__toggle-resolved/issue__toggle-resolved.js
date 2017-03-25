modules.define('issue__toggle-resolved', [
    'i-bem-dom', 'api-request', 'button', 'icon'
], function(provide, bemDom, request, Button, Icon) {

    var MarkResolved = bemDom.declElem('issue', 'toggle-resolved', {

        _onClickToggleResolved: function(event) {
            var issue = event.bemTarget.params;
            var toggleButton = this.findChildBlock(Button);
            var buttonStatusIcon = this.findChildBlock(Icon);

            toggleButton.setMod('disabled');
            this._emit('toggle-resolved-loading');

            // TODO: adopt Notifier
            request(issue.number, {
                method: 'PATCH',
                body: { state: issue.state === 'closed' ? 'open' : 'closed' }
            }).then(function(result) {
                this._emit('toggle-resolved-success');
                buttonStatusIcon.toggleMod('bg', 'question-circle', 'check-circle');
                return result;
            }.bind(this)).catch(function(error) {
                console.error(error);
                this._emit('toggle-resolved-fail');
                return error;
            }.bind(this)).then(function() {
                toggleButton.delMod('disabled');
            });
        }

    }, {
        lazyInit: true,

        onInit: function() {
            this._events(Button).on('click', this.prototype._onClickToggleResolved);
        }
    });

    provide(MarkResolved);
});
