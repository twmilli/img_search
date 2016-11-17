var express = require("express");
var router = require('./routes.js');
var mongo = require("mongodb").MongoClient;

var db_url = process.env.MONGODB_URI;

var app = express();

app.set('port', (process.env.PORT || 8080));

mongo.connect(db_url,function(err,db){
    if (err){
        throw err;
    }
    app.use(function(req,res,next){
        req.db = db;
        next();
    }).use(router);
});

app.listen(app.get('port'), function(){
    console.log('listening on port ' + app.get('port'));
});