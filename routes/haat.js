var express = require("express");
var router = express.Router();
var admin = require('../firebase-proj');
var nodemailer = require('nodemailer');
var db = admin.firestore();

const transporter = nodemailer.createTransport({
	host: "mail.snsartsfestival.in",
	auth: {
		user: 'no-reply',
		pass: process.env.SMTP_PASSWORD,
	},
});

async function renderHaat(req, res, next) {
	artist = {};
	productData = {};
	const ProdRef = db.collection('snsartshaatProducts');
	const snapshot = await ProdRef.get();
	snapshot.forEach(doc => {
		artist_name = doc.data().artistName;
		if (!artist[artist_name] && doc.data().itemPrice != 0) {
			artist[artist_name] = {
			name: artist_name,
			picture: "https://atkhrfnsco.cloudimg.io/v7/dev.snsartsfestival.in/img/favicon.png",
			products: []
			};
			artist[artist_name].products.push(Object.assign(doc.data(), {'id': doc.id}));
		}
		else if (!artist[artist_name] && doc.data().itemPrice == 0){
		artist[artist_name] = {
			name: artist_name,
			picture: "https://atkhrfnsco.cloudimg.io/v7/dev.snsartsfestival.in/img/snsartshaat/"+doc.data().itemImg,
			products: []
			};
		}
		else if (artist[artist_name] && doc.data().itemPrice == 0){
			artist[artist_name].picture = "https://atkhrfnsco.cloudimg.io/v7/dev.snsartsfestival.in/img/snsartshaat/" + doc.data().itemImg;
		}
		else if (artist[artist_name] && doc.data().itemPrice != 0){
			artist[artist_name].products.push(Object.assign(doc.data(), {'id': doc.id}));
		}

	});

	res.render("snsartshaat", {
		title: "SNSN Arts Haat - Kaafila",
		artist: artist,
		scripts: ["/js/haat.js"],
		
	});
}

async function confirmOrder(req, res, next) {
	try {
		data = JSON.parse(req.body.data);

		for (id in data.products) {
			const updateDB = await db.collection("snsartshaatProducts").doc(id).update({sold: {name: data.person.name, email: data.person.email, phone: data.person.phone}})
		}
		res.status(200).send();


		const sendBuyerEmail = await transporter.sendMail({
			from: 'no-reply@snsartsfestival.in',
			to: data.person.email,
			subject: "✅ Order Confirmed",
			html: `Dear ${data.person.name},<br>Thanks for ordering from SNSN Arts Haat. Here are the details of your order<br><br>` + data.html,
		});

		const sendSchoolEmail = await transporter.sendMail({
			from: 'no-reply@snsartsfestival.in',
			to: 'snsartsfestival@gmail.com',
			subject: "📦 New Order",
			html: `${data.person.name}<br>${data.person.email}<br>${data.person.phone}<br><br>` + data.html,
		});

	} catch (err) {
		console.log(err);
	}
}

router.get("/snsnartshaat", (req, res, next) => renderHaat(req, res));
router.post("/confirmorder", (req, res, next) => confirmOrder(req, res));

module.exports = router;