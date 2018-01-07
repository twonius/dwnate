var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");



var data = [
    {
        name: "Waylon Dalton",
        party: "whig",
        state: "MA",
        chamber: "senate",
        image: "https://www.designzzz.com/wp-content/uploads/2012/12/freestock_image_by_goldman555-d495w4s.jpg",
        description: "I ate a baby",
        general: 5000,
        primary: 1000,
        lat: 42.4,
        long: -71,
        author:{
        id: "59ecef01d17ab7684953ccb7",
        username: "twonius" }
    },
    {
        name: "Justine Henderson",
        party: "bull-moose",
        state: "OR",
        chamber: "house",
        image: "http://productshow.ispeboston.org/wp-content/uploads/2015/06/Example-Headshot-A1.jpg",
        description: "Who ya gonna call",
        general: 5000,
        primary: 1000,
        lat: 42.4,
        long: -71,
        author:{
        id: "59ecef01d17ab7684953ccb7",
        username: "twonius" }
    },
    {
        name: "Abdullah Lang",
        party: "whig",
        state: "MS",
        chamber: "house",
        image: "https://thumbs.dreamstime.com/z/attractive-40-year-old-businessman-headshot-761108.jpg",
        description: "Can't touch this",
        general: 5000,
        primary: 1000,
        lat: 42.4,
        long: -71,
        author:{
        id: "59ecef01d17ab7684953ccb7",
        username: "twonius" }
    }
]

function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campaigns!");
         //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campaign");
                    //create a comment

                     Comment.create(
                        {
                            text: "#DontEatTheBaby",
                            amount: 5,
                            author: {
                            id: "59ecef01d17ab7684953ccb7"
                          },
                          campaignID: campground._id
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    });
    //add a few comments
}

module.exports = seedDB;
