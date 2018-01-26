var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var date = new Date();
var backDate = new Date();
backDate.setDate(date.getDate()-1);

var campaigns = [
    {
        name: "Steve King",
        party: "Republican",
        state: "IA",
        chamber: "house",
        image: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Steve_King_official_photo.jpg",
        description:"",
        general: 0,
        primary: 0,
        lat: 42.4,
        long: -71,
        author:{
        id: "59ecef01d17ab7684953ccb7",
        username: "twonius" }
    },
    {
        name: "Robert Menendez",
        party: "Democrat",
        state: "NJ",
        chamber: "senate",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Robert_Menendez_official_Senate_portrait.jpg/800px-Robert_Menendez_official_Senate_portrait.jpg",
        description: "",
        general: 0,
        primary: 0,
        lat: 42.4,
        long: -71,
        author:{
        id: "59ecef01d17ab7684953ccb7",
        username: "twonius" }
    },
    {
        name: "Elizabeth Warren",
        party: "Democrat",
        state: "MA",
        chamber: "senate",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Elizabeth_Warren%2C_official_portrait%2C_114th_Congress.jpg/800px-Elizabeth_Warren%2C_official_portrait%2C_114th_Congress.jpg",
        description: "",
        general: 0,
        primary: 0,
        lat: 42.4,
        long: -71,
        author:{
        id: "59ecef01d17ab7684953ccb7",
        username: "twonius" }
    },
{
    name: "Mitch McConnell",
    party: "Republican",
    state: "KY",
    chamber: "senate",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Mitch_McConnell_portrait_2016.jpg/800px-Mitch_McConnell_portrait_2016.jpg",
    description: "",
    general: 0,
    primary: 0,
    lat: 42.4,
    long: -71,
    author:{
    id: "59ecef01d17ab7684953ccb7",
    username: "twonius" }
},
{
    name: "Tom Cotton",
    party: "Republican",
    state: "AK",
    chamber: "senate",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Tom_Cotton_official_Senate_photo.jpg/800px-Tom_Cotton_official_Senate_photo.jpg",
    description: "",
    general: 0,
    primary: 0,
    lat: 42.4,
    long: -71,
    author:{
    id: "59ecef01d17ab7684953ccb7",
    username: "twonius" }
},
{
    name: "Nancy Pelosi",
    party: "Democrat",
    state: "CA",
    chamber: "house",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Nancy_Pelosi_2012.jpg/800px-Nancy_Pelosi_2012.jpg",
    description: "",
    general: 0,
    primary: 0,
    lat: 42.4,
    long: -71,
    author:{
    id: "59ecef01d17ab7684953ccb7",
    username: "twonius" }
},
{
    name: "Paul Ryan",
    party: "Republican",
    state: "WI",
    chamber: "house",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Speaker_Paul_Ryan_official_photo_%28cropped_2%29.jpg/800px-Speaker_Paul_Ryan_official_photo_%28cropped_2%29.jpg",
    description: "",
    general: 0,
    primary: 0,
    lat: 42.4,
    long: -71,
    author:{
    id: "59ecef01d17ab7684953ccb7",
    username: "twonius" }
},
{
    name: "Chuck Schumer",
    party: "Democrat",
    state: "NY",
    chamber: "senate",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Chuck_Schumer_official_photo.jpg/800px-Chuck_Schumer_official_photo.jpg",
    description: "",
    general: 0,
    primary: 0,
    lat: 42.4,
    long: -71,
    author:{
    id: "59ecef01d17ab7684953ccb7",
    username: "twonius" }
}

]

donations =

[
//   {  text: "#Shutdown2018",
//     amount: 6,
//     author: {
//     id: "59ecef01d17ab7684953ccb7",
//     username: "Anton Maes"
//   }
//   //createdAt: date,
//   //campaignID: campground._id
// }
// ,
// {   text: "#Shutdown2018",
//     amount: 7,
//     author: {
//              id: "59ecef01d17ab7684953ccb7",
//              username: "Anton Maes"
//             },
//    createdAt: backDate
//   //campaignID: campground._id
// }
];


function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campaigns!");
         //add a few campgrounds
        campaigns.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campaign");
                    //create a comment

                     donations.forEach(function(commentData){
                            commentData.campaignID = campground._id
                            Comment.create(commentData, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment._id);
                                campground.save();
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
