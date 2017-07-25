block('pager').content()(node => {
    const { data } = node;
    const pagination = Object.assign({ current: true }, data.pagination);
    const pageCount = pagination.last ? pagination.last.match(/\&page=(\d+)/i)[1] :
        parseInt(pagination.prev.match(/\&page=(\d+)/i)[1]) + 1;
    const result = [];

    const createItem = (type, index) => {
        return {
            elem: 'item',
            elemMods: { type: type },
            url: pagination[type] || `?page=${index}`,
            number: index
        };
    };

    for (let i = 1; i <= pageCount; i++) {
        result.push(createItem('number', i));
    }

    // собираем последовательность из стрелок начала, цифер  и стрелок конца
    return ['first', 'prev'].reduce((acc, type, index) => {
            pagination[type] && acc.push(createItem(type, index));
            return acc;
        }, []).concat(result, ['next', 'last'].reduce((acc, type, index) => {
            pagination[type] && acc.push(createItem(type, index));
            return acc;
        }, []));

});
