var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Campaign  = require("./models/campaign"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    session = require("express-session"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override"),
    Middleware = require("./middleware/index.js" ),
    sslRedirect = require('heroku-ssl-redirect');

// configure dotenv
require('dotenv').load();

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campaignRoutes = require("./routes/campaigns"),
    indexRoutes      = require("./routes/index")



// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/dwnate';

mongoose.connect(databaseUri, { useMongoClient: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(sslRedirect());
//require moment
app.locals.moment = require('moment');
//seedDB(); //seed the database



// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// UPDATE CAMPAIGN TOALS

// var interval = setInterval(function() {
//   Middleware.campaignTotals()
// }, 1000)







app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});




app.use("/", indexRoutes);
app.use("/campaigns", campaignRoutes);
app.use("/campaigns/:id/comments", commentRoutes);

const port = process.env.PORT || 3000;
const ip = process.env.IP;

app.listen(port, ip, function(){
   console.log(`The Dwnate Server Has Started! on ${ip} : ${port}`);
});
