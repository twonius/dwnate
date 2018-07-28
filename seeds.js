var mongoose = require("mongoose");
var campaign = require("./models/campaign");
var Comment   = require("./models/comment");

var date = new Date();
var backDate = new Date();
backDate.setDate(date.getDate()-1);

var data;
$.getJSON("data.json", function(json) {
  data = json;
});

donations =

[
//   {  text: "#Shutdown2018",
//     amount: 6,
//     author: {
//     id: "59ecef01d17ab7684953ccb7",
//     username: "Anton Maes"
//   }
//   //createdAt: date,
//   //campaignID: campaign._id
// }
// ,
// {   text: "#Shutdown2018",
//     amount: 7,
//     author: {
//              id: "59ecef01d17ab7684953ccb7",
//              username: "Anton Maes"
//             },
//    createdAt: backDate
//   //campaignID: campaign._id
// }
];


function seedDB(){
   //Remove all campaigns
   campaign.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campaigns!");
         //add a few campaigns
        data.forEach(function(seed){
            campaign.create(seed, function(err, data){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campaign");
                    //create a comment

                     donations.forEach(function(commentData){
                            commentData.campaignID = campaign._id
                            Comment.create(commentData, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campaign.comments.push(comment._id);
                                campaign.save();
                                console.log("Created new comment: ",comment.campaignID);
                            }

                        });

                      });
            }});
        });
    });
    //add a few comments
}

module.exports = seedDB;
