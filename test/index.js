process.env.NODE_ENV = 'test';
const app = require('../app');
const db = require('../connectors/db');
const expect = require('chai').expect;
const request = require('supertest');
const moment = require('moment');

const Receipt = require('mongoose').model('Receipt');

describe('Generate Receipt', function () {
    before(async function () {
        // this.timeout(15000);
        await db.connect();

        //record for valid return receipt before 20 hours
        await new Receipt({
            isReturnable: true,
            registrationNumber: 'RJ19CE0635',
            fee: 200,
            direction: false,
            createdOn: moment().subtract(20, 'hour')
        }).save();

        //record for invalid return receipt before 24 hours
        await new Receipt({
            isReturnable: true,
            registrationNumber: 'RJ19CE0634',
            fee: 200,
            direction: false,
            createdOn: moment().subtract(25, 'hour')
        }).save();
    });
    after(async function () {
        await db.close();
    });

    it('400 if direction is missing', async function () {
        const res = await request(app).post('/api/receipt/generate').send({
            "registrationNumber": "RJ27CE1234",
            "isReturnable": false
        });

        const body = res.body;
        expect(res.statusCode).to.equal(400);
        expect(body.statusCode).to.equal(400);
        expect(body.status).to.equal(0);
        expect(body.prettyMsg).to.equal('ValidationError: "direction" is required');
    });

    it('400 if isReturnable is missing', async function () {
        const res = await request(app).post('/api/receipt/generate').send({
            "registrationNumber": "RJ27CE1234",
            "direction": true
        });

        const body = res.body;
        expect(res.statusCode).to.equal(400);
        expect(body.statusCode).to.equal(400);
        expect(body.status).to.equal(0);
        expect(body.prettyMsg).to.equal('ValidationError: "isReturnable" is required');
    });
    it('400 if registrationNumber is missing', async function () {
        const res = await request(app).post('/api/receipt/generate').send({
            "isReturnable": false,
            "direction": true
        });

        const body = res.body;
        expect(res.statusCode).to.equal(400);
        expect(body.statusCode).to.equal(400);
        expect(body.status).to.equal(0);
        expect(body.prettyMsg).to.equal('ValidationError: "registrationNumber" is required');
    });

    it('400 if registrationNumber is invalid', async function () {
        const res = await request(app).post('/api/receipt/generate').send({
            "registrationNumber": "RJ27C",
            "isReturnable": false,
            "direction": true
        });

        const body = res.body;
        expect(res.statusCode).to.equal(400);
        expect(body.statusCode).to.equal(400);
        expect(body.status).to.equal(0);
        expect(body.prettyMsg).to.equal('ValidationError: "registrationNumber" with value "RJ27C" fails to match the required pattern: /^[a-zA-Z0-9]{6,10}$/');
    });

    it('Create simple non returnable receipt', async function () {
        const res = await request(app).post('/api/receipt/generate').send({
            "registrationNumber": "RJ27CE1234",
            "isReturnable": false,
            "direction": false
        });
        const body = res.body;
        expect(body.status).to.equal(1);
        expect(body.data).to.contain.property('_id');
        expect(body.data).to.contain.property('registrationNumber');
        expect(body.data).to.contain.property('fee');
        expect(body.data.fee).to.equal(100);

    });
    it('Create simple returnable receipt', async function () {
        const res = await request(app).post('/api/receipt/generate').send({
            "registrationNumber": "RJ27CE1234",
            "isReturnable": true,
            "direction": false
        });
        const body = res.body;
        expect(body.status).to.equal(1);
        expect(body.data).to.contain.property('_id');
        expect(body.data).to.contain.property('registrationNumber');
        expect(body.data).to.contain.property('fee');
        expect(body.data.fee).to.equal(200);
    });
    it('Create valid return receipt if returning before 24 hours', async function () {
        const res = await request(app).post('/api/receipt/generate').send({
            "registrationNumber": "RJ19CE0635",
            "isReturnable": true,
            "direction": true
        });
        const body = res.body;
        expect(body.status).to.equal(1);
        expect(body.data).to.contain.property('_id');
        expect(body.data).to.contain.property('registrationNumber');
        expect(body.data).to.contain.property('fee');
        expect(body.data).to.contain.property('returnOn');
        expect(body.data.fee).to.equal(200);
    });

    it('Create new receipt if old return has been already used', async function () {
        const res = await request(app).post('/api/receipt/generate').send({
            "registrationNumber": "RJ19CE0635",
            "isReturnable": true,
            "direction": true
        });
        const body = res.body;
        expect(body.status).to.equal(1);
        expect(body.data).to.contain.property('_id');
        expect(body.data).to.contain.property('registrationNumber');
        expect(body.data).to.contain.property('fee');
        expect(body.data).to.not.contain.property('returnOn');
        expect(body.data.fee).to.equal(200);
    });

    it('Create new receipt if return after 24 hours', async function () {
        const res = await request(app).post('/api/receipt/generate').send({
            "registrationNumber": "RJ19CE0634",
            "isReturnable": true,
            "direction": true
        });
        const body = res.body;
        expect(body.status).to.equal(1);
        expect(body.data).to.contain.property('_id');
        expect(body.data).to.contain.property('registrationNumber');
        expect(body.data).to.contain.property('fee');
        expect(body.data).to.not.contain.property('returnOn');
        expect(body.data.fee).to.equal(200);
    });
});