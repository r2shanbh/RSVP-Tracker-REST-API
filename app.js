//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/guestListDB", {useNewUrlParser: true, useUnifiedTopology: true });

const guestSchema = {
  name: String,
  phoneNumber: Number,
  email: String,
  attendance: {
    type: String,
    enum: ["tbd", "attending", "not attending"]
  }
};

const Guest = mongoose.model("Guest", guestSchema);

// Routing for API requests and responses related to all guest
app.route("/guests")
.get(function(req, res){
  Guest.find(function(err, guestList){
    if (!err) {
      res.send(guestList);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){
  const newGuest = new Guest({
    name: req.body.name,
    phoneNumber: req.body.number,
    email: req.body.email,
    attendance: req.body.attendance
  });

  newGuest.save(function(err){
    const msg = err ? err : "Added person to the guest list!" ;
    res.send(msg);
  });
})

.delete(function(req, res){
  Guest.deleteMany(function(err){
    const msg = err ? err : "Deleted guest list!" ;
    res.send(msg);
  });
})

// Routing for API requests and responses related to a single person
app.route("/guests/:guestName")
.get(function(req, res){
  const guestName = req.params.guestName;

  Guest.findOne({name: guestName}, function(err, foundGuest){
    if (foundGuest) {
      res.send(foundGuest);
    } else {
      res.send("Guest not found");
    }
  });
})

.patch(function(req, res){
  Guest.update(
    {title: req.params.guestName},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Guest Info updated!");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Guest.deleteOne(
    {title: req.params.guestName},
    function(err){
      if (!err){
        res.send("Guest removed from invitee list!");
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
