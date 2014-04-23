// Generated by CoffeeScript 1.7.1
var Profile, db, fs, mongoose, nodemailer, profileSchema, request, smtpTransport, textSearch;

nodemailer = require("nodemailer");

mongoose = require("mongoose");

textSearch = require("mongoose-text-search");

fs = require("fs");

request = require("request-json");

smtpTransport = nodemailer.createTransport("SMTP", {
  host: "secure.emailsrvr.com",
  secureConnection: true,
  port: 465,
  auth: {
    user: "user@bridgenoble.com",
    pass: "password"
  }
}, mongoose.connect("mongodb://localhost/githubdb"), db = mongoose.connection, profileSchema = new mongoose.Schema({
  avatar_url: String,
  html_url: String,
  repos_url: String,
  name: String,
  company: String,
  blog: String,
  location: String,
  hireable: Boolean,
  bio: String,
  email: {
    type: String,
    required: true,
    index: true
  },
  repos: [
    {
      name: String,
      html_url: String,
      language: []
    }
  ],
  messages: [
    {
      author: String,
      body: String,
      date: {
        type: Date,
        "default": Date.now
      }
    }
  ],
  comments: [
    {
      author: String,
      body: String,
      date: {
        type: Date,
        "default": Date.now
      }
    }
  ]
}), profileSchema.plugin(textSearch), Profile = mongoose.model('Profile', profileSchema), exports.findAll = function(req, res) {
  return Profile.find(function(err, profiles) {
    if (err) {
      return console.log(err);
    } else {
      return res.send(profiles);
    }
  });
}, exports.search = function(req, res) {
  var searchTerm;
  searchTerm = req.body.query;
  return Profile.textSearch(searchTerm, function(err, profiles) {
    if (err) {
      return console.log(err);
    } else {
      return res.send(profiles);
    }
  });
}, exports.comp = function(req, res) {
  var client, searchTerm;
  searchTerm = req.body.query;
  client = request.newClient('http://api.crunchbase.com/v/1/');
  return client.get("search.js?query=" + searchTerm + "&entity=company&api_key=sxpx4ehymgj83ksgk7qbzmzc", function(err, resp, body) {
    if (err) {
      return console.log(err);
    } else {
      return res.send(body.results);
    }
  });
}, exports.updateProfile = function(req, res) {
  var id, update;
  id = req.params.id;
  update = req.body;
  console.log("id: " + id);
  console.log("update: " + update);
  return Profile.findById(id, function(err, profile) {
    profile.author = "steven";
    return profile.save(function(err) {
      if (err) {
        console.log(err);
      }
      return res.send(profile);
    });
  });
}, exports.sendEmail = function(req, res) {
  var Emailer, data, emailer, options, profile;
  profile = req.body;
  console.log("Emailing: " + JSON.stringify(profile.name));
  options = {
    to: {
      email: "steven.evans@bridgenoble.com",
      name: "Rick",
      surname: "Roll",
      subject: "FAO: " + profile.name + " - Award Winning Financial Tech Startup - London",
      template: "invite"
    }
  };
  data = {
    name: "Rick",
    surname: "Roll",
    id: "3434_invite_id"
  };
  Emailer = require("../lib/emailer");
  emailer = new Emailer(options, data);
  return emailer.send(function(err, result) {
    if (err) {
      return console.log(err);
    } else {
      console.log("Message sent: " + result);
      res.send("Email sent to: " + profile.name + " id:" + profile._id);
      return Profile.update({
        _id: profile._id
      }, {
        $push: {
          messages: {
            author: 'Steven',
            body: mailOptions.Html
          }
        }
      }, {
        upsert: true
      }, function(err, data) {});
    }
  });
});
