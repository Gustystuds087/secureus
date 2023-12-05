const Joi = require('joi');

module.exports.warrantySchema = Joi.object({
  warranty: Joi.object({
    company: Joi.string().required(),
    product: Joi.string().required(),
    purchase: Joi.date().less('now').required(),
    period: Joi.number().required().min(0),
    description: Joi.string().required(),
  }).required(),
});
