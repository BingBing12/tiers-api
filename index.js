const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const dotenv = require("dotenv").config();

const API_KEY = process.env.api_key;

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/ratingDB", {
  useNewUrlParser: true,
});

const influencerSchema = {
  name: String,
  age: Number,
};

const userSchema = {
  username: String,
  email: String,
  password: String,
};

const Influencer = mongoose.model("Influencer", influencerSchema);
const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.send("connected");
});

app.get("/influencers", function (req, res) {
  Influencer.find(function (err, influencers) {
    if (!err && req.headers.api_key === API_KEY) {
      res.send(influencers);
    } else if (req.headers.api_key !== API_KEY) {
      res.send("unauthorized access");
    } else {
      res.send(err);
    }
  });
});

app.get("/users", function (req, res) {
  User.find(function (err, users) {
    if (!err && req.headers.api_key === API_KEY) {
      res.send(users);
    } else if (req.headers.api_key !== API_KEY) {
      res.send("unauthorized access");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function () {
  console.log("connected to port 3000");
});
