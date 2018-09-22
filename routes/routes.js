const routesToControllers = [
  { route: '/scrapes', bodyCb: require('../controllers/scrapes') },
  { route: '/users', bodyCb: require('../controllers/users') },
  { route: '/access', bodyCb: require('../controllers/access') }
];

module.exports = routesToControllers;
