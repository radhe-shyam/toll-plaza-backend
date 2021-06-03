const Receipt = require('mongoose').model('Receipt');
const response = require('./../../utils/response');
const moment = require('moment');


/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @returns object
 */
const generateReceipt = async (req, res, next) => {
    try {
        let { registrationNumber, isReturnable, direction } = req.body;

        let doc = await Receipt.findOneAndUpdate({
            registrationNumber,
            direction: !direction,
            isReturnable: true,
            returnOn: { $exists: false },
            createdOn: { $gte: moment().subtract(1, 'day') }
        }, { returnOn: new Date() }, { new: true });

        if (!doc) {
            doc = await new Receipt({
                registrationNumber,
                isReturnable,
                fee: isReturnable ? 200 : 100,
                direction
            }).save();
        }

        return response.sendSuccessResponse(req, res, doc);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    generateReceipt
}