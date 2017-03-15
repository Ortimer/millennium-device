var express = require('express')
var app = express();

//Static resourses
app.use(express.static(__dirname + "/build", { maxAge: 86400000 }));

//app.use(express.static('./public'));

// Funcion home
var home = function (req, res) {
	res.sendfile('build/index.html');
};

// Routes
app.get('/', home);

app.listen(process.env.PORT || 3000); //the port you want to use
