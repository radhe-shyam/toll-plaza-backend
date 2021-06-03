const router = require('express').Router();
const receiptRoutes = require('./receipt/receipt.route');

router.get('/health', (req, res) => res.send('Working fine'));
router.use('/receipt', receiptRoutes);

module.exports = router;