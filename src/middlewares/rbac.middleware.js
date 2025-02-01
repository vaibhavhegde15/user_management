const { ForbiddenError } = require('../utils/customErrors');

function authorizeRoles(roles = []) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError('You are not authorized to perform this action'));
    }
    next();
  };
}

module.exports = { authorizeRoles };
