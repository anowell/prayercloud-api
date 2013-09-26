
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , User = require('../models/user')


// Initialize passport to use FacebookStrategy
exports.initialize = function (config) {
    console.log("URI for FB: " + config.facebook.hostUri)
    passport.use(new FacebookStrategy({
            clientID: config.facebook.appId,
            clientSecret: config.facebook.appSecret,
            callbackURL: config.facebook.hostUri+"/auth/facebook/callback"
        }, 
		function(accessToken, refreshToken, profile, done) {
            console.log("Received Facebook profile")
            //console.log(profile)

            User.findAndUpdateOrCreate(accessToken, profile, function (err, user) {
                if(err) done(err)
                else {
                    console.log("User exists: " + user.displayName )
                    User.updateFriends(user, function(err) {
                        if(err) { console.log("Error updating friends cache: " + err) }
                        done(null, user)
                    })
                }
            });
        }));


    // Initialize passport to serialize users into the session.
    passport.serializeUser(function(user, done) {
        console.log("serialize " + user.displayName + " as " + user.id)
        done(null, user.id);
    })

    // Initialize passport to deserialize users out of the session.
    passport.deserializeUser(function(id, done) {
        User.findOne({_id : id}, function (err, user) {
            //console.log("deserialize " + id + " to " + user.displayName)
            done(err, user);
        })
    })
    
}


// Routing middleware
exports.authenticateUser = function(req, res, next) {
    // access-token authentication
    if (req.param('access_token')) { 
        console.log("Attempting access-token authentication");
        return authenticateToken(req, res, next); 
    }

    // session-based authentication
    console.log("Attempting session-based authentication");
    if (req.isAuthenticated()) { 
        return next(); 
    }

    res.redirect('/login')
}

var authenticateToken = function(req, res, next) {
    var query = {
        accessToken:    req.param('access_token')
    }

    User.findOne(query, function(err, user) {
        if (err) next(err)
        else if (!user) next(new Error('Failed to authenticate access token' + query ))
        else {
            req.user = user
            next()
        }
    })
}
