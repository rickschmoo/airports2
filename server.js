var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var AIRPORTS_COLLECTION = "airports";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// const DATABASE_URI = process.env.MONGODB_URI
const DATABASE_URI= process.env.MONGODB_URI || "mongodb://127.0.0.1/mydb";

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(DATABASE_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready: " + DATABASE_URI);

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
    // let airportCount = db.collection(AIRPORTS_COLLECTION).find().count();
    db.collection(AIRPORTS_COLLECTION).find().toArray(function(err, results) {
      console.log('Airports available: ' + results.length);
    });
  });
});


/////////////////////////////
// CONTACTS API ROUTES BELOW
/////////////////////////////

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/airports"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/airports", function(req, res) {
  db.collection(AIRPORTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get airports.");
    } else {
      res.status(200).json(docs);
    }
  });
});

