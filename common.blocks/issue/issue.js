modules.define('issue', [
    'i-bem-dom', 'button', 'functions', 'comments', 'api-request', 'editing', 'syntax-highlighter'
], function(provide, bemDom, Button, Functions, Comments, request, Editing, SyntaxHighlighter) {
    var Issue = bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    var toggleResolved = this._elem('toggle-resolved');
                    var commentsButton = this._elem('comments-button') && this._elem('comments-button').findMixedBlock(Button);
                    var editButton = this._elem('edit-button') && this._elem('edit-button').findMixedBlock(Button);

                    this._events(toggleResolved)
                        .on('toggle-resolved-loading', this._onToggleResolvedLoading)
                        .on('toggle-resolved-fail', this._onToggleResolvedFail)
                        .on('toggle-resolved-success', this._onToggleResolvedSuccess);
                    this._events(commentsButton).on('click', this._onClickCommentsButton);
                    this._events(editButton).on('click', this._onClickEditButton);
                }
            }
        },

        _onToggleResolvedLoading: function() {
            this._elem('actions').setMod('loading');
        },

        _onToggleResolvedFail: function() {
            this._elem('actions').delMod('loading');
        },

        _onToggleResolvedSuccess: function() {
            this._elem('actions').delMod('loading');
            this.toggleMod('state', 'closed', 'open');
        },

        _onClickCommentsButton: function(event) {
            var button = event.bemTarget;
            var footer = this._elem('footer');
            var comments = this.findChildBlock(Comments);

            event.preventDefault();

            comments ? comments.toggleMod('hidden') :
                request(button.params.number + '/comments')
                    .then(function(data) {
                        bemDom.append(footer.domElem, data);
                    });
        },

        _onClickEditButton: function() {
            this.findMixedBlock(Editing).setMod('state', 'editing');
        },

        _onEditFormCompleted: function(e, data) {
            this._elem('header-link').domElem.text(data.title);
            this._elem('content-body').domElem.html(SyntaxHighlighter.highlight(data.rawBody));
        },

        _onGetForm: function(e, formHtml) {
            bemDom.append(this._elem('date').domElem, formHtml);
        }
    }, {
        lazyInit: true,

        onInit: function() {
            this._events(Button).on({ modName: 'js', modVal: 'inited' }, Functions.noop);
            this._events(Editing)
                .on('updateIssue', this.prototype._onEditFormCompleted)
                .on('insertIssueForm', this.prototype._onGetForm);

        }
    });

    provide(Issue);
});
