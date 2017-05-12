block('user').content()(function() {
    var user = this.ctx.user;

    return [
        {
            elem: 'avatar',
            elemMods: { size: this.mods.size || 'm' },
            url: user.avatar_url
        },
        {
            elem: 'login',
            mix: { block: 'page', elem: 'link' },
            content: user.login
        }
    ];
});
