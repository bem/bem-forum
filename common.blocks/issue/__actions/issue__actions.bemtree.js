block('issue').elem('actions').content()(function() {
    // TODO: можно переделать actions как блок, который можно примиксовать
    // то к чему примиксовали получит такую вот панельку
    // можно указать данные для абсолютного позиционирования наверное
    // и прокинуть контролы
    return [
        {
            block: 'spin',
            mods: { theme: 'islands', size: 'm' }
        },
        {
            block: 'issue',
            elem: 'actions-controls',
            content: this.ctx.content
        }
    ];
});
