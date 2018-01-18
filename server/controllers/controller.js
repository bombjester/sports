var mongoose = require('mongoose');
var Userstable = mongoose.model('users');
var Gosu = require('gosugamers-api');



module.exports = (function() {
	return{


		signup: function(req,res){
				//console.log(req.body.email);
				if( req.body.password != req.body.repassword){
					console.log("Password Not Same");
				}
				else if (req.body.password = req.body.repassword){
					var copy = req.body.email;
					console.log(copy, "Is the copy");
					var lowercase = copy.toLowerCase();
					var insert = new Userstable({
						email: lowercase,
						password: req.body.password
					});

					insert.save(function(err,result){
						if (err){
							console.log("Error saving to MLab", err);
							if (err.code === 11000){
								res.json("Same Name");
							}
						}
						else{
							res.json("Success Registering");
						}
					})
				}
				
		},
		login: function(req,res){
			Userstable.findOne({email:req.body.email}, function (err, result){
				
				if (err){
					console.log("Error pulling  name from db" );
				}
				else {
					
					if (result == null){
						console.log("cant find user");
						res.json("cant find user");
						
					}
					else if (result.email == req.body.email && req.body.password == result.password){
						//console.log("success logging in");
						res.json("Success Loggging In");
					}
					else{
						//console.log("password is wrong");
						res.json("Wrong Password")
					}
				}
			})
		},
		test: function(req,res){
			console.log("get here");
			Gosu.fetchMatchUrls('dota2', function(err, urls) {
  				console.log(urls);
			});
		},
	














	}
})();