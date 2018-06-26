var Comment = require('../models/comment');
var Campaign = require('../models/campaign');
var mongoose    = require("mongoose");

module.exports = {
  isLoggedIn: function(req, res, next){

      if(req.isAuthenticated()){
      if(true){
          return next();
      }
      req.flash('error', 'You must be signed in to do that!');
      res.redirect('/login');
  },
  checkUsercampaign: function(req, res, next){
    Campaign.findById(req.params.id, function(err, foundcampaign){
      if(err || !foundcampaign){
          console.log(err);
          req.flash('error', 'Sorry, that campaign does not exist!');
          res.redirect('/campaigns');
      } else if(foundcampaign.author.id.equals(req.user._id) || req.user.isAdmin){
          req.campaign = foundcampaign;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/campaigns/' + req.params.id);
      }
    });
  },
  checkUserComment: function(req, res, next){
    Comment.findById(req.params.commentId, function(err, foundComment){
       if(err || !foundComment){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/campaigns');
       } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            req.comment = foundComment;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/campaigns/' + req.params.id);
       }
    });
  },
  isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'This site is now read only thanks to spam and trolls.');
      res.redirect('back');
    }
  },
  isSafe: function(req, res, next) {
    if(req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
      next();
    }else {
      req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
      res.redirect('back');
    }
  }
  ,campaignTotals: function() {
    // add in [] when using match
    Comment.aggregate(
          //{$match: { "campaignID" : req.params.id}},
          {$group: { _id :  "$campaignID", total: {$sum: "$amount"} }}, function(err, totals){

            totals.forEach(function(seed){
              Campaign.findByIdAndUpdate(seed._id,{ primary : seed.total}, function(err,obj){
                //console.log(obj);
                if(err){
                  console.log(err);
                }else{

                }
              })
            });

            })


  },
    getUser: function() {





    }
}
