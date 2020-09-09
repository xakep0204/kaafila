var admin = require("firebase-admin");

const serviceAccount = require(process.env.SERVICE_ACCOUNT);
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;