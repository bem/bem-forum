block('user').content()(function() {
    var user = this.ctx.user;

    return [
        {
            elem: 'avatar',
            url: user.avatar_url
        },
        {
            elem: 'login',
            mix: { block: 'page', elem: 'link' },
            content: user.login
        }
    ];
});
