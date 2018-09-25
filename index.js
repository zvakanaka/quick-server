require('dotenv').config();
const restify = require('restify');
const server = restify.createServer({ name: process.env.SERVER_NAME || 'quick-server', version: process.env.SERVER_VERSION || '1.0.0' });
const routes = require('./routes/routes');

server.on('NotFound', function (req, res) {
  const body = `${req.method} ${req.url} Not Found`;
  console.log(body);
  res.writeHead(404, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/html'
  });
  res.write(body);
  res.end();
});

function htmlGet(route, bodyCb) {
  server.get(route, async function (req, res) {
    console.log(req.method, req.url);
    const body = await bodyCb();
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'text/html'
    });
    res.write(body);
    res.end();
  });
}

routes.forEach(route => htmlGet(route.route, route.bodyCb));

server.listen(process.env.PORT || 8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
