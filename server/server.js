// Generated by CoffeeScript 1.7.1
var app, bodyParser, cors, email, express, http, logger, profiles;

express = require("express");

bodyParser = require("body-parser");

http = require("http");

cors = require("cors");

logger = require("morgan");

profiles = require("./routes/profiles2");

email = require("./routes/email");

app = express();

app.use(logger("dev"));

app.use(bodyParser());

app.use(cors());

app.get("/profiles", profiles.findAll);

app.get("/profiles/:id", profiles.findById);

app.put("/profiles/:id", profiles.updateProfile);

app["delete"]("/profiles/:id", profiles.deleteProfile);

app.post("/email", email.sendEmail);

app.post("/search", profiles.search);

app.post("/comp", profiles.comp);

app.get("/templates", email.findAll);

app.post("/templates", email.addTemplate);

app.listen(3000);

console.log("Listening on port 3000 ;)");
