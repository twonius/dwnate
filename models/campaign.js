var mongoose = require("mongoose");

var campaignSchema = new mongoose.Schema({
   name: String,
   image: String,
   state: String,
   district: String,
   party: String,
   chamber: String,
   tenure: String,
   link: String,
   primary: {type:Number,default:0},

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
