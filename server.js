require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const pg = require('pg');
const pool = new pg.Pool({ connectionString: connectionString });
var express = require('express');
const app = express();
var router = express.Router();
const path = require('path');
//const port = 3000;
const bcrypt = require('bcryptjs');

console.log(__dirname);

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var session = require('express-session');
app.use(session({ secret: 'open sesame', resave: true, saveUninitialized: false }));
var ssn;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug');

app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'), function() {
	console.log('Node server is running on port ' + app.get('port'));
});

router.use(express.static(path.join(__dirname, 'public')));

//login
app.post('/login', (req, res) => {
	ssn = req.session;

	var email = req.body.email;
	let password = req.body.password;
	let hash = bcrypt.hashSync(password, 10);

	var sql = 'SELECT * FROM user_account WHERE email = $1 LIMIT 1';
	pool.query(sql, [ email ], function(err, result) {
		if (err) {
			console.error('Error running query', err);
		}
		else {
			//logging
			for(var i = 0; i < result.rows.length; i++) {
				console.log("=================" + result.rows[i]);
			}

			//end logging
			if(result.rows[0] == 'undefined' || result.rows[0] == null) {
				res.render('pages/login', {
					alert: 'Login failed. Please try again or register a new account.'
				});
			}
			bcrypt.compare(password, result.rows[0].password, function(err, same) {
				if (err) {
					console.error('Error comparing passwords', err);
				}
				else {
					if (same) {
						id = result.rows[0].user_account_id;
						ssn.userId = id;
						console.log('login user id: ' + ssn.userId);
						result = getNotes(id, res);
					}
					else {
						res.render('pages/login', {
							alert: 'Login failed. Please try again or register a new account.'
						});
					}
				}
			});
		}
	});
});

//logout
app.get('/logout', function(req, res, next) {
	if (req.session) {
		// delete session object
		req.session.destroy(function(err) {
			if (err) {
				return next(err);
			}
			else {
				return res.redirect('login');
			}
		});
	}
});

app.get('/viewRegister', function(req, res){
	res.render('pages/register', {
	  title: 'Home'
	});
});

app.get('/viewLogin', function(req, res){
	res.render('pages/login', {
	  title: 'Home'
	});
});

app.post('/register', (req, res) => {
	var email = req.body.email;
	var password = req.body.password;
	var passwordCopy = req.body.passwordCopy;

	if (password != passwordCopy) {
		res.render('pages/register', {
			alert: 'The passwords do not match. Please try again'
		});
	}
	else {
		let hash = bcrypt.hashSync(password, 10);
		var sql = 'INSERT INTO user_account (email, password) VALUES($1, $2) RETURNING user_account_id';
		pool.query(sql, [ email, hash ], function(err, result) {
			if (err) {
				if(err.code == 23505) {
					res.render('pages/register', {
						alert: 'This email has already been used. Please use another'
					});
					
				}
				else{
					res.render('pages/register', {
						alert: 'Error'
					});
				}
			}
			else {
				ssn = req.session;
				ssn.userId = result.rows[0].user_account_id;
				getNotes(ssn.userId, res);
			}
		});
	}
});

app.get('/add', (req, res) => {
	res.render('pages/add');
});

app.get('/viewNotes', (req, res) => {
	getNotes(ssn.userId, res);
});

app.post('/newNote', (req, res) => {
	var title = req.body.title;
	var content = req.body.content;
	let curr_date = getDateString();
	console.log("this is the current date: " + curr_date);
	var user_id = ssn.userId;

	var sql = 'INSERT INTO notes (title, content, date_created, user_account_id) VALUES($1, $2, $3, $4)';
	pool.query(sql, [ title, content, curr_date, user_id ], function(err, result) {
		if (err) {
			console.error('Error adding note', err);
		}
		else {
			console.log('note added successfully');
			getNotes(ssn.userId, res);
		}
	});
});

app.post('/editView', (req, res) => {
	var myTitle = req.body.title;
	var myContent = req.body.content;
	var myNote_id = req.body.note_id;
	let curr_date = getDateString();

	console.log(myTitle + ' ' + myContent + ' ' + myNote_id + ' ' + curr_date);
	res.render('pages/edit', {
		title: myTitle,
		content: myContent,
		note_id: myNote_id,
		curr_date: curr_date
	});
})

app.post('/edit', (req, res) => {
	var title = req.body.title;
	var content = req.body.content;
	var note_id = req.body.note_id;
	let curr_date = getDateString();


console.log(title + content + note_id + curr_date);
	var sql = 'UPDATE notes SET title = $1, content = $2, date_created = $3 WHERE note_id = $4';
	pool.query(sql, [ title, content, curr_date, note_id ], function(err, result) {
		if (err) {
			console.error('Error running query', err);
		}
		else {
			getNotes(ssn.userId, res);
		}
	});
});

app.post('/deleteNote', (req, res) => {
	var note_id = req.body.note_id;
	var sql = 'DELETE FROM notes WHERE note_id = $1';
	pool.query(sql, [ note_id ], function(err, result) {
		if (err) {
			console.error('Error deleting', err);
		}
		else {
			getNotes(ssn.userId, res);

		}
	});
});


app.get('/', (req, res) => {
	res.render('pages/login');
});
app.use('/', router);

//functions
function getNotes(id, res) {
	sql = 'SELECT * FROM notes WHERE user_account_id = $1 ORDER BY date_created DESC';

	pool.query(sql, [ id ], function(err, result) {
		if (err) {
			return res.status(500).send(err);
		}

		res.render('pages/notes', {
			notes: result.rows,
			test: 'this is a test'
		});
	});
}

function getDateString() {
	let date_ob = new Date();
	let date = ('0' + date_ob.getDate()).slice(-2);
	let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
	let curr_date = '';
	curr_date = month + '-' + date + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds;
	return curr_date;
}
