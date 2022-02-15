const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { type } = require("express/lib/response");
const app = express();
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const API_KEY = process.env.api_key;

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose
  .connect("mongodb://localhost:27017/ratingDB", {
    useNewUrlParser: true,
  })
  .then(console.log("connected to db"));

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

app.route("/register").post((req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (!err) {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
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
    }
  });
});

app.route("/influencers/:influencerID").get((req, res) => {
  Influencer.findOne({ _id: req.params.influencerID }, (err, result) => {
    if (!err && req.headers.api_key === API_KEY) {
      res.send(result);
    } else if (req.headers.api_key !== API_KEY) {
      res.send("unauthorized");
    } else {
      res.send(err);
    }
  });
});

app.route("/login/:userEmail").get((req, res) => {
  User.findOne({ email: req.params.userEmail }, (err, entry) => {
    if (!err && req.headers.api_key === API_KEY) {
      bcrypt.compare(req.body.password, entry.password, function (err, result) {
        if (!err) {
          res.send(result);
        }
      });
    } else if (req.headers.api_key !== API_KEY) {
      res.send("unauthorized");
    } else {
      res.send(err);
    }
  });
});

app.route("/users/:userID").get((req, res) => {
  User.findOne({ _id: req.params.userID }, (err, result) => {
    if (!err && req.headers.api_key === API_KEY) {
      const { password, ...others } = result._doc;
      res.send(others);
    } else if (req.headers.api_key !== API_KEY) {
      res.send("unauthorized");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function () {
  console.log("connected to port 3000");
});
