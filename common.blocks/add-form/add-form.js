modules.define('add-form', [
    'i-bem-dom', 'button', 'spin', 'editor', 'alert'
], function(provide, bemDom, Button, Spin, Editor, Alert) {
    var AddForm = bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    this._editor = this._elem('editor').findMixedBlock(Editor);
                    this._alert = this._elem('alert').findMixedBlock(Alert);
                }
            },

            loading: function(modName, modVal) {
                this._elem('editor').findMixedBlock(Editor).setMod('disabled', modVal);
                this._elem('submit-btn').findMixedBlock(Button).setMod('disabled', modVal);
                this._elem('spinner').findMixedBlock(Spin).setMod('visible', modVal);
            }
        },

        showErrorMessage: function(errorMessage) {
            return this.showMessage(errorMessage, 'error');
        },

        showSuccessMessage: function(successMessage) {
            return this.showMessage(successMessage, 'success');
        },

        showMessage: function(message, type) {
            this._alert.setText(message).setMod('type', type).delMod('hidden');

            return this;
        },

        hideMessage: function() {
            this._alert.setMod('hidden');

            return this;
        },

        _gatherData: function() {
            return {
                text: this._editor.getVal()
            };
        },

        _onSubmit: function() {
            var gatheredData = this._gatherData();
            var emptyFields = [];

            Object.keys(gatheredData).forEach(function(key) {
                if (gatheredData[key].trim().length === 0) {
                    emptyFields.push(key);
                }
            });

            if (emptyFields.length) {
                this._emit('empty-data', emptyFields);
                return;
            }

            this._emit('submit', gatheredData);
        }
    }, {
        lazyInit: true,
        onInit: function() {
            this._events('submit-btn').on('submit', this.prototype._onSubmit);
        }
    });

    provide(AddForm);
});
