# Quick-Server
Serve HTML or JSON

`$ npm install --save quick-server`

## Hello World Server

```js
const quickServer = require('quick-server');

const routes = [
  { route: '/hello-world', bodyCb: () => { return '<h1>Hello World</h1>' } },
  { route: '/users-table', bodyCb: require('./controllers/users') },
  { route: '/add-user', bodyCb: require('./controllers/addUser'), method: 'POST', responseType: 'JSON' }
];

quickServer.init(routes, { port: 8080 });
```

Deploy with cron job:
```sh
@reboot cd /home/you/path/to/your-quick-server && /home/you/.nvm/versions/node/v8.11.1/bin/node index.js 3456
```
