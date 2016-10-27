var express     =   require('express'),
    app         =   express(),
    request     =   require('request'),
    bodyParser  =   require('body-parser'),
    mongoose    =   require('mongoose'),
    Restaurant  =   require("./models/restaurant"),
    Comment     =   require("./models/comment"),
    passport    =   require("passport"),
    LocalStrategy = require("passport-local"),
    User        =   require("./models/user"),
    seedDB      =   require("./seeds"),
    methodOverride = require("method-override"),
    flash       =   require("connect-flash");
    
//Requiring routes
var commentRoutes       = require("./routes/comments"),
    restaurantRoutes    = require("./routes/restaurants"),
    indexRoutes          = require("./routes/index");
    
//seedDB();

//Passport configuration
app.use(require("express-session")({
    secret: "Holly is the best person ever",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
mongoose.connect("mongodb://peckish:peckishdb@ds029486.mlab.com:29486/peckish")
//mongoose.connect("mongodb://localhost/peckish");
//__dirname = current directory of this script (app.js)
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

//Variables available on all pages as locals
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//app.use(<<START OF ROUTES>> e.g. all restaurants will start with "/restaurants/")
app.use("/restaurants/:id/comments", commentRoutes);
app.use(indexRoutes);
app.use("/restaurants", restaurantRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Peckish Server started...");
});