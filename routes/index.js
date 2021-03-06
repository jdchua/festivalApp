var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get("/",function(req, res){
   res.render("landing"); 
});

// show register form
router.get("/register", function(req, res){
    res.render("register", {page: "register"});
});

// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    if (req.body.adminCode === "secretcode123") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
       if (err){
           req.flash("error", "Someone is already registered with that username");
           console.log("hello");
           return res.redirect("/register");
       } 
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to FestivalCamp " + user.username);
           res.redirect("/festivals");
       });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login", {page:"login"});
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/festivals",
        failureRedirect:"/login",
        failureFlash: "Invalid username or password."
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
   req.logout(); 
   req.flash("success", "Logged you out!!!");
   res.redirect("/festivals");
});

module.exports = router;