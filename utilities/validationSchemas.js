const Joi = require('joi');

const routeSchema = Joi.object({
    title: Joi.string().required(),
    style: Joi.string().required(),
    rating: Joi.string().required()
})

const cragSchema = Joi.object({
    crag: Joi.object({
        title: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required()
    }).required()
})

module.exports = {routeSchema, cragSchema};