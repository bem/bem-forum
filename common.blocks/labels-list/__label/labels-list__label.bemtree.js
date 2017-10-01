block('labels-list').elem('label').content()(function() {
    const { ctx, block } = this;
    const { name, color } = ctx;

    const brightness = {
        active: 95,
        usual: 40
    };

    function calcBrightness(hex, percent) {
        const calcChannelBrightness = channel =>
            ((0 | (1 << 8) + channel + (256 - channel) * percent / 100).toString(16)).substr(1);

        return `#${[0, 2, 4].map(index => calcChannelBrightness(parseInt(hex.substr(index, 2), 16))).join('')}`;
    }

    return {
        block: 'link',
        mix: { block, elem: 'link' },
        url: this.data.pathPrefix + '/?labels=' + name,
        attrs: {
            style: [
                `background-color: ${calcBrightness(color, brightness.active)}`,
                `border-color: #${color}`
            ].join(';')
        },
        js: {
            name,
            usualColor: calcBrightness(color, brightness.active),
            activeColor: calcBrightness(color, brightness.usual)
        },
        content: name
    };
});
