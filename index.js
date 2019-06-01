const restify = require('restify');
const restifyPlugins = require('restify-plugins');
const defaultHandlers = require('./defaultHandlers');

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
  const server = restify.createServer({
    name: options.serverName || 'quick-server',
    version: options.semverVersion || '1.0.0'
  });

  server.use(restifyPlugins.bodyParser());

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

  const customRouteHandlers = options.routeHandlers ? options.routeHandlers : null;
  routes.forEach(route => {
    const routeSetupFunc = getRouteSetupFunc(route, customRouteHandlers);
    const prefix = options.prefix ? options.prefix : '';
    const path = `${prefix}${route.route}`;
    routeSetupFunc(server, path, route.bodyCb);
  });

  server.listen(options.port || 8080, () => {
    console.log('%s listening at %s', server.name, server.url);
  });

  return server;
}

module.exports = {
  init
};
