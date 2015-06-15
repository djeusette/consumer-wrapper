let MongoClient = require('mongodb').MongoClient

function parseUri(uri) {
  let regex = /(.+\/\/.+\/.+)\/([^\/\?]+)(\?.+){0,1}$/
  let match = regex.exec(uri)

  if (!match)
    throw new Error("Malformed URI " + uri)

  let replicatSet = match[3] || ""

  return {
    dbUri          : match[1] + replicatSet,
    collectionName : match[2]
  }
}

function closeConnectionAndHandleError(db, err, callback) {
  if (db) {
    db.close(function(closingError) {
      if (closingError)
        return callback(closingError)
      callback(err)
    })
  } else
    callback(err)
}

function connectToDatabase(uri) {

}


// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});

class MongoDbStore {

  constructor(uri, collectionName) {
    this.uri            = uri
    this.collectionName = collectionName
  }

  initialize() {
    @db.createCollection @collectionName, {w:1}, (err, collection) =>
      return @_closeConnectionAndReturn @db, err, callback if err?
      @collection = collection
      callback null
  }
}

module.exports = MongoDbStore
