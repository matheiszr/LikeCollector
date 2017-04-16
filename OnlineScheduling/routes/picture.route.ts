"use strict";
import { Picture } from '../models/picture.model';

function randomPictureId(){
    return Math.floor(Math.random() * (70 - 1));
}

module.exports = function (router) {
    router.get('/random', function (req, res, next){
        Picture.find({id:randomPictureId()}, function(err, data){
            res.writeHead(200, {"Content-Type": "application/json"});
            var json = JSON.stringify({
                id: data[0].id,
                likes: data[0].likes,
                image: data[0].image
            });
            res.end(json);
         });
    });
    router.put('/liked', function (req, res, next) {
        var id = req.body.id;
        var likes = req.body.likes;
        //var image = req.body.image;
        if(!id || !likes /*|| !image*/) {
            return res.status(500).send('Id and likes and image is required.');
        } else {
            /*Picture.findOneAndUpdate({'id':id}, { $set: { 'like':likes } }, {upsert:true}, function(err, doc){
                if (err) return res.send(500, { error: err });
                return res.status(200).send("Picture successfully liked!");
            });*/
            // a fenti valamiert nem mukodik tobben is panaszkodtak ra a neten igy masik megoldas:
            Picture.find({id:id}, function(err, picture) { //keressuk meg az eredeti doksit
                if (err) return res.send(500, { error: err });
                if(likes > picture[0].likes + 1){// nem csak egyel lett modositva!
                    return res.status(400).send("More than one like is not allowed!");
                } else if(likes == 0){
                    return res.status(400).send("Like must bigger than 0!");
                } else if(likes < picture[0].likes){
                    return res.status(400).send("Something is wrong likes are less than in server!");
                } else if(likes == picture[0].likes){
                    return res.status(400).send("Please like this picture before update it.");
                }
                picture[0].likes = likes;  // modositsuk a likokat
                picture[0].save(function(err) { //mentem a modositasokat
                   if (err) return res.send(500, { error: err });
                   return res.status(200).send("Picture successfully liked!");
                });
            });
        }
    });

    return router;
};
