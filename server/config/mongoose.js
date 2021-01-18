var mongoose = require('mongoose');
// require file-system so that we can load, read, require all of the model files
var fs = require('fs');
// connect to the database
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://Admin:1234@ds249737.mlab.com:49737/sport_highlights');
mongoose.connect('mongodb://Admin:1234@sport-highlights-shard-00-00.71v5v.mongodb.net:27017,sport-highlights-shard-00-01.71v5v.mongodb.net:27017,sport-highlights-shard-00-02.71v5v.mongodb.net:27017/sport_highlights?ssl=true&replicaSet=atlas-hnm5mg-shard-0&authSource=admin&retryWrites=true&w=majority')
// specify the path to all of the models
var models_path = __dirname + '/../models'
// read all of the files in the models_path and for each one check if it is a javascript file before requiring it
fs.readdirSync(models_path).forEach(function(file) {
  if(file.indexOf('.js') > 0) {
    require(models_path + '/' + file);
  }
})
