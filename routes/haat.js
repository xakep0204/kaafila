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
		productData[doc.id] = doc.data();
		let artist_name = doc.data().artistName;
		if(!artist[artist_name] && doc.data().itemPrice != 0) {
			artist[artist_name] = {
			name: artist_name,
			picture: "https://atkhrfnsco.cloudimg.io/v7/dev.snsartsfestival.in/img/favicon.png",
			products: []
			};
			artist[artist_name].products.push(doc.data());
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
			artist[artist_name].products.push(doc.data());
		}

	});

	res.render("snsartshaat", {
		title: "SNS Arts Haat - Kaafila",
		artist: artist,
		productData: JSON.stringify(productData),
		scripts: ["/js/haat.js"],
		
	});
}

async function confirmOrder(req, res, next) {
	try {
		data = JSON.parse(req.body.data);
		const info = await transporter.sendMail({
			from: 'no-reply@snsartsfestival.in',
			to: data.person.email,
			subject: "Hello ✔",
			text: JSON.stringify(data.products),
		});

		res.status(200).send();
	} catch (err) {
		console.log(err);
	}
}

router.get("/snsnartshaat", (req, res, next) => renderHaat(req, res));
router.post("/confirmorder", (req, res, next) => confirmOrder(req, res));

module.exports = router;