const restify = require('restify');
const restifyPlugins = require('restify-plugins');
require('dotenv').config();
const defaultHandlers = require('./lib/defaultHandlers');
const hasOwnProperty = require('./lib/hasOwnProperty');
const debug = require('./lib/debug.js');

function getRouteSetupFunc (route, customRouteHandlers) {
  // the type being sent back in the response
  const contentType = hasOwnProperty(route, 'responseType') ? route.responseType.toLowerCase() : 'text/html';
  // default to get
  const method = hasOwnProperty(route, 'method') ? route.method.toUpperCase() : 'GET';

  const customHandler = customRouteHandlers.find(handler => handler.method === method && handler.responseType === contentType);
  if (customHandler && typeof customHandler.func === 'function') return customHandler.func;

  const defaultHandler = defaultHandlers.find(handler => handler.method === method && handler.responseType === contentType);
  if (defaultHandler && typeof defaultHandler.func === 'function') return defaultHandler.func;

  throw new Error(`No handler for ${contentType} ${method}`);
}

function init (routes, options = {}) {
  const server = restify.createServer({
    name: options.serverName || 'mere-server',
    version: options.semverVersion || '2.0.0'
  });

  server.use(restifyPlugins.bodyParser());

  server.on('NotFound', (req, res) => {
    const body = `${req.method} ${req.url} Not Found`;
    debug(body);
    res.writeHead(404, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'text/html'
    });
    res.write(body);
    res.end();
  });

  const customRouteHandlers = Array.isArray(options.routeHandlers) ? options.routeHandlers : [];
  routes.forEach(route => {
    const routeSetupFunc = getRouteSetupFunc(route, customRouteHandlers);
    const prefix = options.prefix ? options.prefix : '';
    const path = `${prefix}${route.route}`;
    routeSetupFunc(server, path, route.bodyCb);
  });

  server.listen(options.port || 8080, () => {
    debug('%s listening at %s', server.name, server.url);
  });

  return server;
}

module.exports = {
  init
};
