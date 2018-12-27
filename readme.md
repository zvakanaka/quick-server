# Quick-Server
Server render freshly generated HTML

### Define a Route (`routes/routes.js`)
The `bodyCb` method generates HTML - served at `route`:
```js
const routesToControllers = [
  { route: '/report', bodyCb: require('../controllers/report') }
];
```

### Write a Controller (e.g. `controllers/report.js`)
```js
const model = require('../../model');
function buildPage() {
  const data = model.getLastReport();
  return `<html><body>${data}</body></html>`;
}

module.exports = function() {
  return buildPage();
};
```
### Serve
Install dependancies:
```bash
npm install
```

Local development:
```bash
npm start
```

*Change port in `.env` with `PORT=3456`*

Deploy with cron job:
```sh
@reboot cd /home/you/path/to/quick-server && /home/you/.nvm/versions/node/v8.11.1/bin/node index.js 3456
```

