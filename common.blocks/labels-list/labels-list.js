modules.define(
    'labels-list',
    ['i-bem-dom', 'location', 'link', 'labels-list__label'],
    function(provide, bemDom, Location, Link, Label) {

    var LabelsList = bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    var queryLabels = Location.getUri().queryParams.labels;
                    var activeLabels = (queryLabels && queryLabels[0]) ? queryLabels[0].split(',') : [];

                    this.findChildElems(Label).forEach(function(label) {
                        if (activeLabels.indexOf(label.params.name) !== -1) label.setMod('active');
                    }, this);
                }
            }
        }
    });

    provide(LabelsList);
});
