const debug = require('./debug.js');

function htmlGET (server, route, bodyCb) {
  server.get(route, async (req, res) => {
    debug(req.method, req.url);
    const body = await bodyCb(req.url, req);
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'text/html'
    });
    res.write(body);
    res.end();
  });
}

function jsonPOST (server, route, bodyCb) {
  server.post(route, async (req, res) => {
    debug(req.method, req.url);
    const body = await bodyCb(req.body, req);
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'application/json'
    });
    res.write(body);
    res.end();
  });
}

module.exports = [
  {func: htmlGET, method: 'GET', responseType: 'text/html'},
  {func: jsonPOST, method: 'POST', responseType: 'application/json'}
];
