// Generated by CoffeeScript 1.7.1
var BSON, Db, Server, db, mongo, server;

mongo = require("mongodb");

Server = mongo.Server;

Db = mongo.Db;

BSON = mongo.BSONPure;

server = new Server("localhost", 27017, {
  auto_reconnect: true
});

db = new Db("githubdb", server);

db.open(function(err, db) {
  if (!err) {
    console.log("Connected to 'githubdb' database");
    return db.collection("profiles", {
      strict: true
    }, function(err, collection) {
      if (err) {
        return console.log("The 'profiles' collection doesn't exist. Hungry for DATA! nom nom...");
      }
    });
  }
});

exports.findById = function(req, res) {
  var id;
  id = req.params.id;
  console.log("Retrieving profile: " + id);
  return db.collection("profiles", function(err, collection) {
    return collection.findOne({
      _id: new BSON.ObjectID(id)
    }, function(err, item) {
      return res.send(item);
    });
  });
};

exports.findAll = function(req, res) {
  return db.collection("profiles", function(err, collection) {
    return collection.find().toArray(function(err, items) {
      return res.send(items);
    });
  });
};

exports.addProfile = function(req, res) {
  var profile;
  profile = req.body;
  console.log("Adding profile: " + JSON.stringify(profile));
  return db.collection("profiles", function(err, collection) {
    return collection.insert(profile, {
      safe: true
    }, function(err, result) {
      if (err) {
        return res.send({
          error: "An error has occurred"
        });
      } else {
        console.log("Success: " + JSON.stringify(result[0]));
        return res.send(result[0]);
      }
    });
  });
};

exports.updateProfile = function(req, res) {
  var id, profile;
  id = req.params.id;
  profile = req.body;
  console.log("Updating profile: " + id);
  console.log(JSON.stringify(profile));
  return db.collection("profiles", function(err, collection) {
    return collection.update({
      _id: new BSON.ObjectID(id)
    }, wine, {
      safe: true
    }, function(err, result) {
      if (err) {
        console.log("Error updating profile: " + err);
        return res.send({
          error: "An error has occurred"
        });
      } else {
        console.log("" + result + " document(s) updated");
        return res.send(profile);
      }
    });
  });
};

exports.deleteProfile = function(req, res) {
  var id;
  id = req.params.id;
  console.log("Deleting profile: " + id);
  return db.collection("profiles", function(err, collection) {
    return collection.remove({
      _id: new BSON.ObjectID(id)
    }, {
      safe: true
    }, function(err, result) {
      if (err) {
        return res.send({
          error: "An error has occurred - " + err
        });
      } else {
        console.log("" + result + " document(s) deleted");
        return res.send(req.body);
      }
    });
  });
};
