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

app
  .route("/influencers")
  .get((req, res) => {
    Influencer.find((err, influencers) => {
      if (!err && req.headers.api_key === API_KEY) {
        res.send(influencers);
      } else if (req.headers.api_key !== API_KEY) {
        res.send("unauthorized access");
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newInfluencer = new Influencer({
      name: req.body.name,
      age: req.body.age,
    });
    if (req.headers.api_key === API_KEY) {
      newInfluencer.save((err) => {
        if (!err) {
          res.send("successful");
        } else {
          res.send("unsuccessful");
        }
      });
    } else {
      res.send("unauthorized access");
    }
  });

app
  .route("/users")
  .get((req, res) => {
    User.find((err, users) => {
      if (!err && req.headers.api_key === API_KEY) {
        res.send(users);
      } else if (req.headers.api_key !== API_KEY) {
        res.send("unauthorized access");
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    if (req.headers.api_key === API_KEY) {
      newUser.save((err) => {
        if (!err) {
          res.send("successful");
        } else {
          res.send("unsuccessful");
        }
      });
    } else if (req.headers.api_key !== API_KEY) {
      res.send("unauthorized access");
    }
  });

app.listen(3000, function () {
  console.log("connected to port 3000");
});
