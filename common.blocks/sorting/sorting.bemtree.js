block('sorting').content()(function() {
    var block = this.block,
        i18n = this.require('i18n');

    return [
        {
            elem: 'title',
            content: i18n(block, 'sort')
        },
        {
            block : 'select',
            mix: { block: 'sorting', elem: 'select'},
            mods : { mode : 'radio', theme : 'islands', size : 'l', width: 'available' },
            name : 'sorting',
            val : 0,
            options : [
                { val: 'sort=created&direction=desc', text: i18n(block, 'newest') },
                { val: 'sort=created&direction=asc', text: i18n(block, 'oldest') },
                { val: 'sort=comments&direction=desc', text: i18n(block, 'mostCommented') },
                { val: 'sort=comments&direction=asc', text: i18n(block, 'leastCommented') },
                { val: 'sort=updated&direction=desc', text:  i18n(block, 'recentlyUpdated') },
                { val: 'sort=updated&direction=asc', text:  i18n(block, 'leastRecentlyUpdated') }
            ]
        }
    ];
});
