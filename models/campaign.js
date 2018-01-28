var mongoose = require("mongoose");

var campaignSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   state: String,
   party: String,
   chamber: String,
   primary: Number,
   lat: Number,
   long: Number,
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("campaign", campaignSchema);
