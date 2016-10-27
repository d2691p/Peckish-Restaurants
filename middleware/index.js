var middlewareObj = {};
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");

//Middleware to check if a user is logging in
middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

//RESTAURANT OWNERSHIP
middlewareObj.checkRestaurantOwnership = function (req, res, next) {
 if(req.isAuthenticated()){
        Restaurant.findById(req.params.id, function(err, foundRestaurant){
           if(err){
               req.flash("error", "Restaurant not found");
               res.redirect("back");
           }  else {
               // does user own the restaurant?
            if(foundRestaurant.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

//COMMENT OWNERSHIP
middlewareObj.checkCommentOwnership =  function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }else {
               // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}


module.exports = middlewareObj;