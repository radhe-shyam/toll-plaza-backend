require('./receipt.schema');

const router = require('express').Router();
const Joi = require('joi');
const validation = require('express-joi-validation').createValidator({ passError: true });
const receiptCtrl = require('./receipt.controller');

const generateBodySchema = Joi.object({
    registrationNumber: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,10}$')).required(),
    isReturnable: Joi.boolean().required(),
    direction: Joi.boolean().required()
});
router.post('/generate', validation.body(generateBodySchema), receiptCtrl.generateReceipt);

module.exports = router;