var mongoose = require('mongoose');
var Userstable = mongoose.model('users');
var Gosu = require('gosugamers-api');
var osmosis = require('osmosis');
var request = require('request');
var moment = require('moment');
var tz = require('moment-timezone');




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
  						
  						//console.log(finaldotatourney);
  						res.json(finalarray);
  						
  					})
  				})
  			})
  			

  			
  		
  			
		},
		getnba: function(req,res){
			var array = [];
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
			 	//console.log(array);
			 	res.json(array);
			});
			
		},
		getdotatourneys: function(req,res){
			//console.log("trying to get dota toruneys");
			var finaldotatourney = [];
			var dotatemp = [];
			var dotatemp2 = [];
			//Gosu.fetchMatchUrls('dota2', function(err, urls) {
  				//console.log(urls);

  			osmosis.get("http://liquipedia.net/dota2/Main_Page")
  			.find("//*[@id='mw-content-text']/div[3]/div[1]/div/div[1]/div[1]/div[2]/ul/li[2]/ul/li")
  			.set("tourneys")
  			.data(function(results){
  				//console.log(results);
  				dotatemp.push(results.tourneys);
  				//console.log(results, "dota tourney");
  			})
  			osmosis.get("http://liquipedia.net/dota2/Main_Page")
  			.find("//*[@id='mw-content-text']/div[3]/div[1]/div/div[1]/div[1]/div[2]/ul/li[2]/ul/li/a/@href")
  			.set("hrefs")
  			.data(function(results){
  				//console.log(results);
  				dotatemp2.push(results.hrefs);
  				//console.log(results, "dota href");
  				

  			})
  			.done(function(){
  				for (x in dotatemp){
  					finaldotatourney.push({Tournament: dotatemp[x], href: dotatemp2[x]});
  				}
  				res.json(finaldotatourney);
  			})
		},

		getnbaschedule: function(req,res){

			var hrefs = [];
			var finalarray = [];
			osmosis.get("https://www.reddit.com/r/nbastreams/")
			.find("//*[@id='siteTable']/div/div/div/p/a/@href")
			.set("hrefs")
			.data(function(results){
				//console.log(results.hrefs);
				if(results.hrefs.search("/game_thread_") >=1){
					hrefs.push(results);
				}
			})
				
				
			.done(function(){
				request('http://www.espn.com/nba/bottomline/scores', function (error, response, body) {
				//console.log(body);
					var regex = /left\s*(.*?)\s*nba/g;
					var matches = [];
					while(m = regex.exec(body)){
						matches.push(m[1]);
					}
					
					for (x in matches){
						//console.log(matches[x]);
						matches[x] = matches[x].replace(/%20/g, " ");
						matches[x] = matches[x].replace("&", "");
						matches[x] = matches[x].replace(/\d=/gm, "");
						matches[x] = matches[x].replace("^", "");
					}
		
					
					for (x in matches){
						//console.log(matches[x]);
						var pst = "";
						var pushed = false;
						var wordmatch = matches[x].substring(0, matches[x].indexOf(" ")).toLowerCase();
						var match = matches[x].substring(0, matches[x].indexOf("("));
								

						//###### TO CHANGE TO PST

						if(matches[x].search("ET") >= 1){	
							var ettime = matches[x].substring(matches[x].indexOf("("), matches[x].indexOf("ET"));
							//console.log(time);
							ettime = ettime.replace("(", "");
							ettime = moment(ettime, "h:mm a").toDate();
							pst = "(" + moment(ettime).subtract(3, 'hours').format("h:mm a") + " PST)";
							
						}
						else{
							pst = matches[x].substring(matches[x].indexOf("("), matches[x].length);
							
						}
						// console.log(pst, match);
						
						for( y in hrefs){
							//console.log(hrefs[y].hrefs);
							if(hrefs[y].hrefs.search(wordmatch)>=1){
								finalarray.push({game: match,time: pst, href: hrefs[y].hrefs});
								pushed = true;
							}
						}
						if (pushed == false){

							finalarray.push({game: match,time: pst, href: "None"});
							
						}

					}
					//console.log(finalarray);
					res.json(finalarray);

				});

			})
			

			

		},
		getdotagames : function(req,res){
			var array = [];
			var today = moment().format("YYYY-MM-DD");

			request("http://api.sportradar.us/dota2-t1/en/schedules/"+today+"/schedule.json?api_key=k5xrd9rb25ux6p6mqe2mghyc", function (error, response, body){

				var jsonfied = JSON.parse(body);
				// for(games in jsonfied.){
				// 	console.log(games);
				// }
				//console.log(jsonfied.sport_events);
				for(games in jsonfied.sport_events){
					if(jsonfied.sport_events[games].status != "cancelled"){
						var pst = moment(jsonfied.sport_events[games].scheduled);
						var time = pst.tz('America/Los_angeles').format('h:mm a z');
						
						array.push({match_ID: jsonfied.sport_events[games].id, time: time, t_round: jsonfied.sport_events[games].tournament_round.phase + " " + jsonfied.sport_events[games].tournament_round.name,tournament:jsonfied.sport_events[games].tournament, teams: jsonfied.sport_events[games].competitors});
					}
					
				}
				res.json(array);
			})
		},
		getnhlgames :function(req,res){
			var today = moment().format("YYYY/MM/DD");
			
			var hrefs = [];
			var finalarray = [];

			osmosis.get("https://www.reddit.com/r/nhlstreams/")
			.find("//*[@id='siteTable']/div/div/div/p/a/@href")
			.set("hrefs")
			.data(function(results){
				//console.log(results.hrefs);
				if(results.hrefs.search("/game_thread_") >=1){
					hrefs.push(results);
				}
			})
			.done(function(){
				//console.log(hrefs);
				request("http://api.sportradar.us/nhl/trial/v5/en/games/"+today+"/schedule.json?api_key=azsj4dc8kn7xu8z3ebpwke34", function (error, response, body){
					var jsonfied = JSON.parse(body);
					
					for (x in jsonfied.games){
						//console.log(jsonfied.games[x]);
						var pst = moment(jsonfied.games[x].scheduled);
						var time = pst.tz('America/Los_angeles').format('h:mm a z');
						if(jsonfied.games[x].status == "inprogress"){
							finalarray.push({match_id: jsonfied.games[x].id, title: jsonfied.games[x].title, time: "Live", teams: jsonfied.games[x].away.name + " (seed: " + jsonfied.games[x].away.seed + ") at " + jsonfied.games[x].home.name + " (seed " + jsonfied.games[x].home.seed + ")", href: "" });
						}
						else if(jsonfied.games[x].status == "closed"){
							finalarray.push({match_id: jsonfied.games[x].id, title: jsonfied.games[x].title, time: "Ended", teams: jsonfied.games[x].away.name + " (seed: " + jsonfied.games[x].away.seed + ") at " + jsonfied.games[x].home.name + " (seed " + jsonfied.games[x].home.seed + ")", href: "Ended", score: jsonfied.games[x].away_points+" - " + jsonfied.games[x].home_points});
						}
						else if(jsonfied.games[x].status == "unnecessary"){

						}
							
						else{
							finalarray.push({match_id: jsonfied.games[x].id, title: jsonfied.games[x].title, time: time, teams: jsonfied.games[x].away.name + " (seed: " + jsonfied.games[x].away.seed + ") at " + jsonfied.games[x].home.name + " (seed " + jsonfied.games[x].home.seed + ")", href: "None" });
						}
					}
					for(i in finalarray){
						//console.log(finalarray[i]);
						var space_index = finalarray[i].teams.indexOf(" ");
						space_index = Number.parseInt(space_index)+1;
						var text_array = finalarray[i].teams.split(" ");
						
						var wordmatch = text_array[1].toLowerCase();
							
						
						for(y in hrefs){
							
							if(hrefs[y].hrefs.search(wordmatch)>=1 && finalarray[i].time != "Ended"){ 
								
								finalarray[i].href = hrefs[y].hrefs;
								
							}

							
						}
					}
					
					//console.log(finalarray);
					res.json(finalarray);
				});

			
			
			})
		},

		getnhlvods: function(req,res){
			
			var array = [];
			request('https://www.googleapis.com/youtube/v3/search?key=AIzaSyD264dgINbnjfJLCHpYrWST6iKZdJ-RVG8&channelId=UCVhibwHk4WKw4leUt6JfRLg&part=snippet,id&order=date&maxResults=20', function (error, response, body) {
				//console.log(body);
				var jsonfied = JSON.parse(body);
				for (x in jsonfied.items){
					if(jsonfied.items[x].snippet.title[0] == "N" && jsonfied.items[x].snippet.title[1] == "H" && jsonfied.items[x].snippet.title[4] == "H"){
						//console.log(jsonfied.items[x]);
						array.push({title: jsonfied.items[x].snippet.title,  videoID: jsonfied.items[x].id.videoId, thumbnail: jsonfied.items[x].snippet.thumbnails.default.url});
					}
				}
				res.json(array);
			})
		},

	














	}
})();