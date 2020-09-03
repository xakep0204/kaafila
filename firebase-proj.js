var admin = require("firebase-admin");

const serviceAccount = require("/users/aditya/dev/kaafila-security/serviceAccount.json");
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;