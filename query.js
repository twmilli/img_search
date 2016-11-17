var rp = require("request-promise");
var router = require("./routes.js");
const KEY = "3780178-f36556bac00a034a163b16329";
var db;

var queries={
    
    imgSearch(req,res){
        var search = req.params.search;
        var offset = (+req.query.offset || 0);
        var data = getImageData(search, offset);
        db = req.db;
        db.collection("queries")
        .insertOne({
            "term":search,
            "when": new Date()
        });
        
        data.then(function(info){
            res.json(info);
        });
    },
    
    getRecent(req,res){
        db = req.db;
        db.collection("queries")
        .find().sort({$natural: -1})
        .limit(10).toArray(function(err,data){
           if (err){
               throw err;
           }
           data = data.map(function(entry){
               return ({
                   "term": entry.term,
                   "when": entry.when
               });
           });
           res.json(data);
        });
    }
}

function getImageData(query,offset){
    var url = "https://pixabay.com/api/?key=" + KEY + "&q=" + query + "&image_type=photo";
    return (rp(url)
        .then(function(body){
            var data = JSON.parse(body);
            data = data.hits.slice(offset,offset+10);
            data = data.map(function(pic){
                var pic_info = {
                    "url":pic.webformatURL,
                    "tags": pic.tags,
                    "thumbnail":pic.previewURL,
                    "context":pic.pageURL,
                    "author": pic.user
                };
                return pic_info;
            });
            return data;
        })
    );}
    
module.exports = queries;