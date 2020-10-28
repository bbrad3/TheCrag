const Joi = require('joi');

const routeSchema = Joi.object({
    route: Joi.object({
        title: Joi.string().required(),
        crag: Joi.string().required(),
        rating: Joi.string().required()
    }).required()
})

module.exports = routeSchema;