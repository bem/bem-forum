modules.define('editor', [
    'editor__mode', 'syntax-highlighter'
], function(provide, Mode, SyntaxHighlighter, Editor) {
    provide(Editor.declMod({ modName: 'has-preview', modVal: true }, {
        _updatePreview: function() {
            this._elem('preview').domElem.html(SyntaxHighlighter.highlight(this.render()));
        }
    }));
});
