modules.define('syntax-highlighter', ['i-bem-dom', 'prism'], function(provide, bemDom, Prism) {
    var SyntaxHighlighter = bemDom.declBlock(this.name, {}, {
        highlight: function(html) {
            return html.replace(/<code\sclass=["']lang-([^>]*)["']>([\s\S]+?)<\/code>/mg,
                function(code, type, inside) {
                    var types = {
                            js: 'javascript',
                            css: 'css',
                            md: 'markdown',
                            json: 'json'
                        },
                        lang = Prism.languages[types[type] || type] || Prism.languages.markup;

                    return Prism.highlight(inside, lang);
                }
            );
        }
    });

    provide(SyntaxHighlighter);
});
