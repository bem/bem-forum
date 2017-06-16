block('labels')(
    def()(function() {
        const data = this.data;
        const labels = data.labels;

        function increase_brightness(hex, percent) {
            // strip the leading # if it's there
            hex = hex.replace(/^\s*#|\s*$/g, '');

            // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
            if (hex.length == 3) {
                hex = hex.replace(/(.)/g, '$1$1');
            }

            var r = parseInt(hex.substr(0, 2), 16),
                g = parseInt(hex.substr(2, 2), 16),
                b = parseInt(hex.substr(4, 2), 16);

            return '#' +
                ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
                ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
                ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
        }

        return applyNext({
            labelsData: labels.map(label => ({
                name: label.name,
                color: {
                    background: increase_brightness(label.color, 50),
                    border: label.color
                }
            }))
        });
    }),

    content()(function() {
        const { block } = this;

        return [
            {
                elem: 'header',
                content: 'Labels'
            },
            {
                elem: 'content',
                content: this.labelsData.map(label => ({
                    block,
                    elem: 'item',
                    content: {
                        block: 'link',
                        mix: { block, elem: 'label' },
                        url: '/?labels=' + label.name,
                        attrs: {
                            style: [
                                `background-color: ${label.color.background}`,
                                `border: 1px solid #${label.color.border}`
                            ].join(';')
                        },
                        content: label.name
                    }
                }))
            }
        ];
    }),

    elem('item').content()(function() {

    })
);
