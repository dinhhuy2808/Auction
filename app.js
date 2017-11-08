var express = require('express');
var session = require('cookie-session'); // Loads the piece of middleware for sessions
var bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  port:3306,
  user: "root",
  password: "root",
  database:"auction_11072017"
});



/* Using the sessions */
app.use(session({secret: 'todotopsecret'}))


/* If there is no to do list in the session, 
we create an empty one in the form of an array before continuing */
.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
})

/* The to do list and the form are displayed */
.get('/signup', function(req, res) { 
    res.render('signup.ejs', {todolist: req.session.todolist});
})
.get('/success', function(req, res) { 
    res.render('success.ejs');
})
/* Adding an item to the to do list */
.post('/signup/add/', urlencodedParser, function(req, res) {
    var acc = req.body.accountname;
	var name = req.body.name;
	var dob = req.body.dob;
	var email = req.body.email;
	var phone = req.body.phone;
	var address = req.body.address;
	var jobs = req.body.jobs;
	
	con.connect(function(err) {
	  if (err) throw err;
	  var sql = "INSERT INTO USER VALUES ('"+acc+"', '"+name+"','"+dob+"','"+phone+"','"+email+"','"+address+"','"+jobs+"','')";
	  con.query(sql, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted, ID: " + result.insertId);
	  });
	});
	
    res.redirect('/success');
})

/* Deletes an item from the to do list */
.get('/todo/delete/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

/* Redirects to the to do list if the page requested is not found */
.use(function(req, res, next){
    res.redirect('/signup');
})

.listen(8080);   