var express = require("express");
var router = express.Router();
var query = require('./query.js');

router.get('/favicon.ico', function(req, res){
   res.sendStatus(200); 
});

router.get('/', function(req,res){
    res.end();
});

router.get('/api/imagesearch/:search', query.imgSearch);

router.get('/api/latest(*)', query.getRecent);

module.exports = router;