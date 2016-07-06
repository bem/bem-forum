block('user').content()(function() {
    var user = this.ctx.user;

    return [
        {
            elem: 'avatar',
            url: user.avatar_url
        },
        {
            elem: 'login',
            content: user.login
        }
    ];
});