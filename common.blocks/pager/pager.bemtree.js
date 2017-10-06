block('pager').content()(node => {
    const { data } = node;
    const pagination = data.pagination;
    const result = [];

    const createItem = (type, index) => {
        return {
            elem: 'item',
            mix: { block, elem: 'item' },
            elemMods: { type: type },
            url: pagination[type] || `${data.exceptPaginationUrl}&page=${index}`,
            number: index
        };
    };

    for (let i = 1; i <= data.pageCount; i++) {
        result.push(createItem('number', i));
    }

    // gather arrows and numbers correct way
    return [
        ['first', 'prev'].reduce((acc, type, index) => {
            pagination[type] && acc.push(createItem(type, index));
            return acc;
        }, []),
        result,
        ['next', 'last'].reduce((acc, type, index) => {
            pagination[type] && acc.push(createItem(type, index));
            return acc;
        }, [])
    ];
});
