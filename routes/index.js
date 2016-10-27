var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require("../models/user");
var middleware = require("../middleware/index.js");

router.get("/", function(req, res){
    res.render("homepage");
});

//Authorisation register
router.get("/register", function(req,res){
    res.render("register");
});

//Handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Peckish! " + user.username);
           res.redirect("/restaurants"); 
           
        });
    });
});

//Show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//Handle login logic
//Passport.authenticate is middleware - runs before the completion of the route, verifying if a users details are correct
//app.get("/route", middleware, callback)
router.post("/login", passport.authenticate("local", {
        successRedirect:"/restaurants", 
        failureRedirect:"/login",
        failureFlash : true
}));

//Logout user
router.get("/logout", middleware.isLoggedIn, function(req, res){
   req.logout(); 
   req.flash("success", "Logged you out!");
   res.redirect("/restaurants");
});

//Show about page
router.get("/about", function(req, res){
   res.render("about"); 
});

module.exports = router;