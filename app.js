require('dotenv').config();
const { stMonitor, stHttpLoggerMiddleware } = require('sematext-agent-express')
stMonitor.start()
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var eventRouter = require("./routes/event");

var app = express();
app.use(stHttpLoggerMiddleware)

app.use(logger("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));


app.set("view engine", "hbs");
app.engine(
	"hbs",
	hbs({
		extname: "hbs",
		defaultView: "default",
		layoutsDir: __dirname + "/views/layouts/",
		partialDir: __dirname + "/views/partials/",
	}),
);

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", eventRouter);

app.use(function (req, res, next) {
	next(createError(404));
});

app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV === "development" ? err : {};

	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
