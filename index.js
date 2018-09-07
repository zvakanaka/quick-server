require('dotenv').config();
const restify = require('restify');
const server = restify.createServer({ name: 'bike-stats', version: '1.0.0' });
const controllers = {
  users: require('./controllers/users.js')
};

function htmlGet(route, bodyCb) {
  server.get('/users', function (req, res) {
    const body = bodyCb();
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'text/html'
    });
    res.write(body);
    res.end();
  });
}

htmlGet('/users', controllers.users);

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
