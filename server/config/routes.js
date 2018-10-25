var doge = require("./../controllers/controller.js");

module.exports = function(app){
	app.post('/signup', function(req,res){
		doge.signup(req,res);
		//console.log("Get here");
	})
	app.post('/login', function(req,res){
		doge.login(req,res);
	})
	app.get('/getdotavods', function(req,res){
		doge.getdotavods(req,res);
	})
	app.get("/getnba", function(req,res){
		doge.getnba(req,res);
	})
	app.get("/getdotatourneys", function(req,res){
		doge.getdotatourneys(req,res);
	})
	app.get("/getnbaschedule", function(req,res){
		doge.getnbaschedule(req,res);
	})
	app.get("/getnhlgames", function(req,res){
		doge.getnhlgames(req,res);
	})
	app.get("/getnhlvods", function(req,res){
		doge.getnhlvods(req,res);
	})
	app.get("/getdotagames", function(req,res){
		doge.getdotagames(req,res);
	})
	app.get("/getnflgames", function(req,res){
		doge.getnflgames(req,res);
	})
}