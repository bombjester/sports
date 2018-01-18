var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var nflteamsSchema = mongoose.Schema({
  NFL: {type:String},
  Niners: {type:String},
  Patriots: {type: String}
},{_id: false});
var nbateamsSchema = mongoose.Schema({
  NBA: {type: String},
  Warriors: {type:String}
}, {_id : false});
var sportsSchema = mongoose.Schema({
  NBA: [nbateamsSchema],
  NFL: [nflteamsSchema],
},{_id: false});
var UsersSchema = new mongoose.Schema({
  email: {type: String, unique:true},
  password: {type: String},
  sports:[sportsSchema]
},{versionKey: false});


mongoose.model("users", UsersSchema);