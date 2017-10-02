modules.define('reaction', [
    'i-bem-dom', 'button', 'api-request'
], function(provide, bemDom, Button, request) {
    var reaction = bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    this.upButton = this._elem('up').findMixedBlock(Button);
                    this.downButton = this._elem('down').findMixedBlock(Button);
                }
            }
        },
        _changeReaction: function(e) {
            const type = e.target.params.type;

            let sign = type === 'up' ? '+' : '-';

            request.post('change-reaction/' + this.params.entityId, {
                blockType: this.params.blockType,
                direction: sign + 1
            }).then(function(status) {
                let currentVal = Math.abs(this[type + 'Button'].domElem.text()),
                    newVal = status === '201' ? ++currentVal : --currentVal;

                if (!newVal) sign = '';

                this[type + 'Button'].domElem.text(sign + newVal);
            }.bind(this));
        }
    }, {
        lazyInit: true,
        onInit: function() {
            this._events(Button)
                .on('click', this.prototype._changeReaction);
        }
    }
);

    provide(reaction);
});
