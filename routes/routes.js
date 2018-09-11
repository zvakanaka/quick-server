const routesToControllers = [
  { route: '/scrapes', bodyCb: require('../controllers/scrapes') },
  { route: '/users', bodyCb: require('../controllers/users') }
];

module.exports = routesToControllers;
