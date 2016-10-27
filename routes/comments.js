var express = require('express');
// Merge the params from campground and comments together, therefore allowing access to /:id/
var router = express.Router({mergeParams:true});

var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find restaurant by id
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {restaurant: restaurant});
        }
    })
});

//Comments CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
   Restaurant.findById(req.params.id, function(err, restaurant){
       if(err){
           console.log(err);
            res.redirect("/restaurants");
       }else{
           //Finding restaurant, then create a comment and push into restaurant, then save
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong...");
                    console.log(err);
                }else{
                    //Add username and ID to comment
                    comment.author.username = req.user.username;
                    comment.author.id       = req.user._id;

                    //Add star rating
                    if(req.body.comment.star1 === 'on'){
                        comment.rating = 1;
                    }else if(req.body.comment.star2 === 'on'){
                        comment.rating = 2;
                    } 
                    else if(req.body.comment.star3 === 'on'){
                        comment.rating = 3;
                    }
                    else if(req.body.comment.star4 === 'on'){
                        comment.rating = 4;
                    } 
                    else if(req.body.comment.star5 === 'on') {
                        comment.rating = 5;
                    }
                    else {
                        comment.rating = 0;
                    }
                    
                    comment.createdAt = req.body.comment.createdAt
                    
                    //Save comment
                    comment.save();
                    //Add comment to restaurant
                    restaurant.comments.push(comment);
                    restaurant.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/restaurants/" + restaurant._id);
                }
            });
       }
   }); 
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  //  req.params.id; restaurant id
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment updated");
            res.render("comments/edit", {restaurant_id: req.params.id, comment:foundComment});
        }
    });
});

//UPDATE RESTAURANT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // find and update the correct restaurant
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          //redirect somewhere(show page)
          res.redirect("/restaurants/" + req.params.id);
      }
    });
});

//DELETE/DESTROY COMMENTS
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          res.redirect("back");
      }else{
          //Send back to show page
          req.flash("success", "Comment deleted!");
          res.redirect("/restaurants/" + req.params.id);
      }
  });
});


module.exports = router;