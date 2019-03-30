const routesToControllers = [
  { route: '/watches', bodyCb: require('../controllers/watches') },
  { route: '/users', bodyCb: require('../controllers/users') },
  { route: '/access', bodyCb: require('../controllers/access') }
];

module.exports = routesToControllers;
