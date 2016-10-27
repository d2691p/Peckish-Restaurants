var express = require('express');
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware/index.js");
//Add routes to router, not app, then exporting the router at the end

//INDEX
router.get("/", function(req, res){
    Restaurant.find({}, function(err, allRestaurants){
        if(err){
            console.log(err);
        }else{
            res.render("restaurants/index", {restaurants:allRestaurants, currentUser:req.user});
        }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var username = req.user.username;
    var userId = req.user._id;
    var cuisine = req.body.cuisine;
    var location = req.body.location;
    var author = {
        id: userId,
        username: username
    }
    
    var price = '';
    if(req.body.restaurant.pound3 === 'on'){
        price = 3;
    }else if(req.body.restaurant.pound2 === 'on'){
        price = 2;
    }else{
        price = 1;
    }

    var newRestaurant = {
        name: name, 
        image: image, 
        description: desc,
        cuisine: cuisine,
        location: location,
        price: price,
        author: author
    };
    
    Restaurant.create(newRestaurant, function(err, newlyCreate){
        if(err){
            console.log(err);
        }else{
            //redirect back to restaurant list
            res.redirect("/restaurants");
        }
    });
});

//NEW - show form to create new sirw
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("restaurants/new"); 
});

//SHOW - render information about one item
router.get("/:id", function(req, res){
    //Finding restaurant by id, then populating the comments array so it is not just the ID being shown
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
        if(err){
            console.log(err);
        }else{
            res.render("restaurants/show", {restaurant:foundRestaurant});
        }
    });
});


// EDIT RESTAURANT ROUTE
router.get("/:id/edit", middleware.checkRestaurantOwnership, function(req, res){
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
        if(err){
            req.flash("error", "Restaurant does not exist!");
            res.redirect("back");
        }else{
            res.render("restaurants/edit", {restaurant: foundRestaurant});
        }
    });
});

// UPDATE RESTAURANT ROUTE
router.put("/:id", middleware.checkRestaurantOwnership, function(req, res){
    // find and update the correct restaurant
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
       if(err){
           res.redirect("/restaurants");
       } else {
           //redirect somewhere(show page)
           req.flash("success", "Restaurant updated");
           res.redirect("/restaurants/" + req.params.id);
       }
    });
});

//DELETE/DESTROY RESTAURANT
router.delete("/:id", middleware.checkRestaurantOwnership, function(req, res){
    Restaurant.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/restaurants");
       }else{
           req.flash("success", "Restaurant deleted!");
           res.redirect("/restaurants");
       }
   });
});


module.exports = router;