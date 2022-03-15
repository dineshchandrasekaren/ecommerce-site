exports.BigPromise = (func) => (req, res, next) =>
  Promise.resolve(func).catch(next);
