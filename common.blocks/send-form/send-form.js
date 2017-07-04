modules.define('send-form', [
    'i-bem-dom', 'button', 'spin', 'editor', 'input', 'alert'
], function(provide, bemDom, Button, Spin, Editor, Input, Alert) {
    var SendForm = bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    this._editor = this._elem('editor').findMixedBlock(Editor);
                    this._alert = this._elem('alert').findMixedBlock(Alert);
                    this._title = this._elem('title') && this._elem('title').findMixedBlock(Input);
                }
            },

            loading: function(modName, modVal) {
                this._elem('editor').findMixedBlock(Editor).setMod('disabled', modVal);
                this._elem('submit-btn').findMixedBlock(Button).setMod('disabled', modVal);
                this._elem('spinner').findMixedBlock(Spin).setMod('visible', modVal);
            }
        },

        info: {
            issue: {
                fields: ['title', 'body'],
                errorMessage: 'Заполните все поля'
            },
            comment: {
                fields: ['body'],
                errorMessage: 'Сначала надо что-нибудь написать'
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

        getRenderedContent: function() {
            return this._editor.render();
        },

        clear: function() {
            this._editor.setVal('');

            return this;
        },

        fillForm: function(data) {
            this._editor.setVal(data.body);

            if (this._title) {
                this._title.setVal(data.title);
            }
        },

        _gatherData: function() {
            return {
                body: this._editor.getVal(),
                title: this._elem('title') ? this._elem('title').findMixedBlock(Input).getVal() : ' ',
                rawBody: this._getBodyPreview()
            };
        },

        _getBodyPreview: function() {
            this._editor._updatePreview();

            return this._editor._elem('preview').domElem.html();
        },

        _onSubmit: function(event) {
            var formType = event.bemTarget.params.formType;
            var gatheredData = this._gatherData();
            var emptyFields = [];

            this.info[formType].fields.forEach(function(key) {
                if (gatheredData[key].trim().length === 0) {
                    emptyFields.push(key);
                }
            });

            if (emptyFields.length) {
                this.showErrorMessage(this.info[formType].errorMessage);
                return;
            }

            this._emit('submit', Object.assign(gatheredData, { reqType: event.bemTarget.params.reqType }));
        }
    }, {
        lazyInit: true,
        onInit: function() {
            this._events('submit-btn')
                .on('submit', this.prototype._onSubmit);
        }
    });

    provide(SendForm);
});
