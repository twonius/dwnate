var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false},
    address: {
      street1: String,
      street2: String,
      city: String,
      state: String,
      zip: String
    },
    profession: String,
    employer: String
    });

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
