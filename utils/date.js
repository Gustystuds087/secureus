const { off } = require('../models/warranty');

module.exports.dateToISOLikeButLocal = (date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const msLocal = date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  const isoLocal = iso.slice(0, 19);

  return isoLocal.split('T')[0];
};
