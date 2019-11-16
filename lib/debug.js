const debug = process.env.DEBUG && process.env.DEBUG.includes('mere-server')
  ? console.info : () => {};

module.exports = debug;
