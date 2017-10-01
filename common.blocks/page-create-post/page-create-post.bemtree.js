block('page-create-post').content()(() => {
    return {
        block: 'editing',
        js: {
            formType: 'issue'
        },
        content: {
            block: 'send-form',
            formType: 'issue',
            reqType: 'post',
            js: {
                formType: 'issue',
                reqType: 'post'
            }
        }
    };
});
