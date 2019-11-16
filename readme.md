# mere-server
Serve HTML or JSON

`$ npm install --save mere-server`

## Hello World Server

```js
const mereServer = require('mere-server');

const routes = [
  { route: '/hello-world', bodyCb: () => { return '<h1>Hello World</h1>' } },
  { route: '/users-table', bodyCb: require('./controllers/users') },
  { route: '/add-user', bodyCb: require('./controllers/addUser'), method: 'POST', responseType: 'JSON' }
];

mereServer.init(routes, { port: 8080 });
```

## Custom Route Handlers
Streaming video
```js
const mereServer = require('mere-server');
const fs = require('fs');

function streamVideo (server, route, _bodyCb) {
  server.get(route, async (req, res) => {
    const path = '/home/you/video.mp4';
    const stat = fs.statSync(path);
    const total = stat.size;
    const range = req.headers.range || 'bytes=0-';
    const parts = range.replace(/bytes=/, '').split('-');
    const partialstart = parts[0];
    const partialend = parts[1];
    const start = parseInt(partialstart, 10);
    const end = partialend ? parseInt(partialend, 10) : total - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(path, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4'
    });
    file.pipe(res);
  });
}

const routes = [
  {
    route: '/',
    bodyCb: (url, req) => {
      return `<h1>Video Stream Demo</h1>
      <video controls src="http://localhost:8080/video-stream"/>`;
    },
    method: 'GET'
  },
  // GET /video-stream will be handled by the streamVideo function
  { route: '/video-stream', method: 'GET', responseType: 'video/mp4' }
];

mereServer.init(routes, {
  port,
  routeHandlers: [ // custom route handlers
    { method: 'GET', responseType: 'video/mp4', func: streamVideo }
  ]
});
```

Deploy with cron job:
```sh
@reboot cd /home/you/path/to/your-mere-server && /home/you/.nvm/versions/node/v10.15.3/bin/node index.js 3456
```
