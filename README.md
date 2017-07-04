# bem-forum

Source code of https://bem.info/forum.
Uses github.com issues API as backend.

## Installation

```
git clone https://github.com/tadatuta/bem-forum.git
cd bem-forum
npm i
YENV=production npm run make
echo "module.exports = {};" > server/secret-config.js
```

Please provide your github OAuth credentials in `server/secret-config.js` like this:
```js
module.exports = {
    github: {
        tokens: [
            'GENERATED_TOKEN_1',
            'GENERATED_TOKEN_2',
            'GENERATED_TOKEN_3'
        ],
        clientID: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET'
    }
};
```

You may get them on https://github.com/settings/applications/new
For development use `http://localhost:3000/auth/github/callback` as callback URL.

**Note**: `server/secret-config.js` is not under version control.
You may prefer ENV variables `BEM_FORUM_CLIENT_ID` and `BEM_FORUM_CLIENT_SECRET` instead.

Then just run `npm start` for production mode.

## Configuration
Edit `server/config.js` to provide your github repo info.


## Development
```
npm run watch
nodemon
```
