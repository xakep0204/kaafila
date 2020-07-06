var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
<<<<<<< HEAD
  res.render('index', {title:"Kaafila"});
=======
    res.render('index', {
        title: "Express",
        headerStyles: ['/css/navbar.css']
    });
>>>>>>> c1ab19f793e4c08a3ed92029800c92b5a120b713
});

module.exports = router;
