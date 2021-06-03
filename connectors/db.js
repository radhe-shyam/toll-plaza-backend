const config = require('config');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const connect = async () => {
    if (process.env.NODE_ENV === 'test') {
        const Mockgoose = require('mock-mongoose').MockMongoose;
        const mockgoose = new Mockgoose(mongoose);
        await mockgoose.prepareStorage();
    }
    return mongoose.connect(config.get('db'), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

const close = () => {
    return mongoose.disconnect();
};

module.exports = { connect, close }