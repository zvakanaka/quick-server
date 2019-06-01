function htmlGET(server, route, bodyCb) {
  server.get(route, async (req, res) => {
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

function jsonPOST(server, route, bodyCb) {
  server.post(route, async (req, res) => {
    console.log(req.method, req.url);
    const body = await bodyCb(req.body);
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'application/json'
    });
    res.write(body);
    res.end();
  });
}

module.exports = {
  htmlGET,
  jsonPOST
};
