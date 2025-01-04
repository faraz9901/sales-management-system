import Joi from 'joi'

export const salesValidation = Joi.object({
    customerName: Joi.string().required(),
    product: Joi.string().required(),
    price: Joi.number().required(),
    date: Joi.date().required(),
    quantity: Joi.number().required(),
    category: Joi.string().required(),
    invoiceNumber: Joi.number().optional(),
})


export const userValidation = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
});
