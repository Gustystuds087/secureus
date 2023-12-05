const { warrantySchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in');
    return res.redirect('/login');
  }
  next();
};

module.exports.validateWarranty = (req, res, next) => {
  const { error } = warrantySchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');

    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
