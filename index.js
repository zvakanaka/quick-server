require('dotenv').config();
const restify = require('restify');
const server = restify.createServer({ name: process.env.SERVER_NAME || 'quick-server', version: process.env.SERVER_VERSION || '1.0.0' });
const defaultHandlers = require('./defaultHandlers');

server.on('NotFound', (req, res) => {
  const body = `${req.method} ${req.url} Not Found`;
  console.log(body);
  res.writeHead(404, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/html'
  });
  res.write(body);
  res.end();
});

function getRouteSetupFunc(route, customRouteHandlers) {
  // the type being sent back in the response
  const contentType = route.hasOwnProperty('responseType') ? route.responseType.toLowerCase() : 'html';
  // default to get
  const method = route.hasOwnProperty('method') ? route.method.toUpperCase() : 'GET';

  const customHandler = customRouteHandlers ? customRouteHandlers[contentType] && customRouteHandlers[contentType][method] : null;
  if (customHandler) return customHandler;

  const defaultHandler = defaultHandlers[`${contentType}${method}`];
  if (defaultHandler) return defaultHandler;

  throw new Error(`No handler for ${contentType} ${method}`);
}

function init(routes, options = {}) {
  const customRouteHandlers = options.routeHandlers ? options.routeHandlers : null;
  routes.forEach(route => {
    const routeSetupFunc = getRouteSetupFunc(route, customRouteHandlers);
    routeSetupFunc(server, route.route, route.bodyCb);
  });

  server.listen(options.port || 8080, () => {
    console.log('%s listening at %s', server.name, server.url);
  });
}

module.exports = {
  init
};
