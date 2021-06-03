const config = require('config');
const db = require('./connectors/db');
const app = require('./app');

const PORT = config.get('port');

(async () => {
    await db.connect();
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT} and started at ${new Date()}`);
    });
})();