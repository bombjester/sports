var mongoose = require('mongoose');
var Userstable = mongoose.model('users');
var Gosu = require('gosugamers-api');
var osmosis = require('osmosis');
var request = require('request');
var moment = require('moment');




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
		getdotavods: function(req,res){
			var teamarray = [];
			var datearray = [];
			var linkarray = [];
			var finalarray = [];
			
			//Gosu.fetchMatchUrls('dota2', function(err, urls) {
  				//console.log(urls);


  			
  			
  			
			osmosis.get('http://www.gosugamers.net/dota2/vods')
  			.find('#videos/tbody/tr/td/a[span.opp1 and span.opp2]')
  			.set("data")
  			.data(function(results){
  				//console.log(results);
  				var str = results.data;
  				str = str.split(' ').join('');
  					
  				
  				teamarray.push(str);
				
  			})
  			.done(function(){
  				//console.log(teamarray);
  				osmosis.get('http://www.gosugamers.net/dota2/vods')
  				.find('#videos/tbody/tr/td/span.added')//#videos/tbody/tr/td/a@href #videos/tbody/tr/td/span.added 				
  				.set('date')
  				.data(function(results){
  					//console.log(results);
  					datearray.push(results);
  					})
  				.done()
  				.done(function(){
  					osmosis.get('http://www.gosugamers.net/dota2/vods')
  					.find('#videos/tbody/tr/td/a.video@href')
  					.set("link")
  					.data(function(results){
  						linkarray.push(results);
  					})
  					.done(function(){
  						//console.log(linkarray.length, teamarray.length, datearray.length);
  						for (var index in linkarray){
  							finalarray.push({Team: teamarray[index], hyperlink: linkarray[index].link, date_added: datearray[index].date})
  						}
  						res.json(finalarray);
  						
  					})
  				})
  			})
  			

  			
  		
  			
		},
		getnba: function(req,res){
			var array = [];
			console.log("get here");
			//console.log(moment().format("YYYY-MM-DDTHH:mm:ssZ"));
			request('https://www.googleapis.com/youtube/v3/search?key=AIzaSyD264dgINbnjfJLCHpYrWST6iKZdJ-RVG8&channelId=UCLd4dSmXdrJykO_hgOzbfPw&part=snippet,id&order=date&maxResults=30', function (error, response, body) {
			 // console.log('error:', error); // Print the error if one occurred
			  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			  //console.log('body:', body); // Print the HTML for the Google homepage.
			  // for (x in body){
			  // 	console.log(body[x]);
			  // }
			  	var jsonfied = JSON.parse(body);
			 	//console.log(jsonfied);
			 	for (x in jsonfied.items){
			 		
			 		if(jsonfied.items[x].snippet.description.length != 0){
			 			array.push({Title: jsonfied.items[x].snippet.title, Description: jsonfied.items[x].snippet.description, videoID: jsonfied.items[x].id.videoId, Thumbnail: jsonfied.items[x].snippet.thumbnails.default.url});
			 			//console.log(jsonfied.items[x].snippet.description, jsonfied.items[x].id.videoId, jsonfied.items[x].snippet.title,jsonfied.items[x].snippet.thumbnails.default.url );
			 		}
			 	}
			 	res.json(array);
			});
			
		},

	














	}
})();