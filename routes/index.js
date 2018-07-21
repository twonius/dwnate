var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


//root route
router.get("/", function(req, res){
    res.render("landing");
});

router.get("/about_us", function(req,res){
  res.render("about_us")
});


// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'});
});

//handle sign up logic
router.post("/register", function(req, res){

    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: {
            street1: req.body.address.street1,
            street2: req.body.address.street2,
            city: req.body.address.city,
            state: req.body.address.state,
            zip: req.body.address.zip},
        profession: req.body.profession,
        employer: req.body.employer});
    if(req.body.adminCode === process.env.ADMIN_CODE) {
      newUser.isAdmin = true;
   }

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campaigns");
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'});
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {

        successRedirect: "/campaigns",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to Dwnate!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/campaigns");
});


module.exports = router;
