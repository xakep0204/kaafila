var admin = require("firebase-admin");

const serviceAccount = require(process.env.serviceAccount);
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;