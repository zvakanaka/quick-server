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
