exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("you are not allowed to access this information"));
    }

    next();
  };
};
