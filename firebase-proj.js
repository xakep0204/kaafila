var admin = require("firebase-admin");

const serviceAccount = require(process.env.SERVICEACCOUNT);
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;