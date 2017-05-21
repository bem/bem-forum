block('pager').content()(function() {
    var pagination = Object.assign({ current: true }, this.data.pagination);

    return ['first', 'prev', 'current', 'next', 'last'].reduce((acc, type) => {
        pagination[type] && acc.push({
            elem: 'item',
            elemMods: { type: type },
            url: pagination[type]
        });

        return acc;
    }, []);
});
