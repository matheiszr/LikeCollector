import * as express from 'express';
import * as expressSession from 'express-session';
import * as LocalStrategy from 'passport-local';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as Grid from 'gridfs-stream';

// Mongoose ODM...
var mongoose = require('mongoose');
var SALT_WORK_FACTOR = 10;

// Kapcsolodas a MongoDB-hez:
var dbUrl = 'mongodb://likecollector:likecollector123@ds159050.mlab.com:59050/likecollector_db';

var app = express();
app.set('dbUrl', dbUrl);
mongoose.connect(dbUrl);
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);

// NodeJs szerver inditasa:
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(cookieParser());
// random kep lekeres:
app.get('/image/:name', function(req, res) {
    gfs.createReadStream({ filename: req.param('name')}).pipe(res);
});
app.use('/rest/picture', require('./routes/picture.route')(express.Router()));
app.listen(5000, () => {
    console.log('The server is running');
})