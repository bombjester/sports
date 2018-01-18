var doge = require("./../controllers/controller.js");

module.exports = function(app){
	app.post('/signup', function(req,res){
		doge.signup(req,res);
		//console.log("Get here");
	})
	app.post('/login', function(req,res){
		doge.login(req,res);
	})
	app.get('/test', function(req,res){
		doge.test(req,res);
	})
}