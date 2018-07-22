var express = require("express");
var router  = express.Router();
var Campaign = require("../models/campaign");
var Comment = require("../models/comment");
var middleware = require("../middleware");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//var geocoder = require('geocoder');
var { isLoggedIn, checkUsercampaign, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//define shuffle funciton
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

//INDEX - show all campaigns
router.get("/", function(req, res){
  if(req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all campaigns from DB
      Campaign.find({name: regex}, function(err, allCampaigns){
         if(err){
            console.log(err);
         } else {
            res.render("campaigns/index",{Campaigns: allCampaigns, page: 'Campaigns'});
         }
      });
  } else {
      // Get all Campaigns from DB
      Campaign.find({}, function(err, allCampaigns){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allCampaigns);
            } else {
              allCampaignsRand = shuffle(allCampaigns);
              res.render("campaigns/index",{Campaigns: allCampaigns, page: 'Campaigns'});
            }
         }
      });
  }
});

//CREATE - add new campaign to DB
router.post("/", isLoggedIn, isSafe, function(req, res){
  // get data from form and add to campaigns array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var cost = req.body.cost;
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCampaign = {name: name, image: image, description: desc, cost: cost, author:author, location: location, lat: lat, lng: lng};
    // Create a new campaign and save to DB
    Campaign.create(newCampaign, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campaigns page
            //console.log(newlyCreated);
            res.redirect("/campaigns");
        }
    });
  });
});

//NEW - show form to create new campaign
router.get("/new", isLoggedIn, function(req, res){
   res.render("/new");
});

// SHOW - shows more info about one campaign
router.get("/:id", function(req, res){
    //find the campaign with provided ID
    Campaign.findById(req.params.id).populate("comments").exec(function(err, foundcampaign){
        if(err || !foundcampaign){
            console.log(err);
            req.flash('error', 'Sorry, that campaign does not exist!');
            return res.redirect('/campaigns');
        }
        //console.log(foundcampaign)

    //update totals
    //middleware.campaignTotals();

        //render show template with that campaign
        res.render("campaigns/show", {campaign: foundcampaign});
    });
});

// EDIT - shows edit form for a campaign
router.get("/:id/edit", isLoggedIn, checkUsercampaign, function(req, res){
  //render edit template with that campaign
  res.render("campaigns/edit", {campaign: req.campaign});
});

// PUT - updates campaign in the database
router.put("/:id", isSafe, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    Campaign.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campaign){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campaigns/" + campaign._id);
        }
    });
  });
});

// DELETE - removes campaign and its comments from the database
router.delete("/:id", isLoggedIn, checkUsercampaign, function(req, res) {
    Comment.remove({
      _id: {
        $in: req.campaign.comments
      }
    }, function(err) {
      if(err) {
          req.flash('error', err.message);
          res.redirect('/');
      } else {
          req.campaign.remove(function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('/');
            }
            req.flash('error', 'campaign deleted!');
            res.redirect('/campaigns');
          });
      }
    })
});

router.get('/api/user_data', function(req, res) {

    if (req.user === undefined) {
        // The user is not logged in
        res.json({});
    } else {
        res.json({
            username: req.user
        });
    }
});

module.exports = router;
