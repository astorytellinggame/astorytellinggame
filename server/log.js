const debug = (...args) => {
  if (!process.env.DEBUG) return;
  console.log(...args);
};

module.exports = { debug };
