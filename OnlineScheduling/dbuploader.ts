import * as fs from 'fs';
import * as Grid from 'gridfs-stream';
import * as path from 'path';
import { Picture } from './models/picture.model';

/**
 * Itt talalhato az adatbazis feltolto, ami
 * feltolti kezdeti adatokkal az adatbazisunkat.
 * Futtassuk le a szerver elott ha meg ures az adatbazisunk!
 */

var numOfImages = 70;
var imageIndex = 0;

// Mongoose ODM...
var mongoose = require('mongoose');
var SALT_WORK_FACTOR = 10;

// Kapcsolodas a MongoDB-hez:
var dbUrl = 'mongodb://likecollector:likecollector123@ds159050.mlab.com:59050/likecollector_db';
mongoose.connect(dbUrl);

//Adatbazis feltoltese:
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
function uploader(i){
    conn.once('open', function(){
        var imagePath = path.join(__dirname, './pictures/pic (' + imageIndex + ').jpg');
        let gfs = Grid(conn.db);
        // kepek feltoltese az adatbazisba pictures mappabol:
        var writeStream = gfs.createWriteStream({
            filename: 'picture' + imageIndex,
            mode: 'w',
            extension: 'jpg',
            type: 'image/jpg'
        });
        // lezarjuk az olvasot
        writeStream.on('close', function(file) {
            console.log(file.filename + ' written to DB');
        });
        fs.createReadStream(imagePath).pipe(writeStream);
 //       writeStream.end();

        var imageName = 'picture' + imageIndex;
        var picture = new Picture({id: imageIndex, likes: 0, image: imageName});
        picture.save();

        imageIndex++;
    });
    if(numOfImages-1 > i){
        uploader(i+1);
    }
}

uploader(0)