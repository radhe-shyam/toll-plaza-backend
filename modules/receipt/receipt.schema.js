const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receipt = new Schema({
    //vehicle registration number
    registrationNumber: {
        type: String,
        required: true
    },
    //receipt created or journey time
    createdOn: {
        type: Date,
        required: true,
        default: Date.now
    },
    //vehicle returnable
    isReturnable: {
        type: Boolean,
        required: true,
        default: false
    },
    //fee charges
    fee: {
        type: Number,
        required: true
    },
    // vehicle return time if the vehicle is returnable
    returnOn: {
        type: Date
    },
    //direction of the vehicle going, true means coming and false means going
    direction: {
        type: Boolean,
        required: true
    }
});

receipt.index({
    registrationNumber: 1,
    direction: 1,
    isReturnable: 1,
    createdOn: -1
}, {
    partialFilterExpression: {
        isReturnable: { $eq: true }
    }
});

const myModel = mongoose.model('Receipt', receipt);

