var Circle = require('../models/circle')
  , authenticateUser = require('../lib/authentication').authenticateUser
  , ac = require('../lib/access-control')
  , graph = require('fbgraph')
  , _ = require('underscore')
  , User = require('../models/user')
  

// Routes
module.exports = function (app, auth) {
  app.get(  '/api/circles',           authenticateUser, ac.loadCircles, index)
  app.post( '/api/circles',           authenticateUser, processFollowers, create)
  app.get(  '/api/circles/:id',       authenticateUser, loadCircle, verifyFollower, show)
  app.put(  '/api/circles/:id',       authenticateUser, loadCircle, verifyOwner, processFollowers, update)
  app.del(  '/api/circles/:id',       authenticateUser, loadCircle, verifyOwner, destroy)
}



var loadCircle = function(req, res, next) {
    Circle.findById(req.params.id)
        //.populate('owner')
        //.populate('followers')
        .exec( function(err, circle) {
            //console.log(circle)
            if (err) next(err)
            else if (!circle) next(new Error('Failed to load circle ' + req.params.id))
            else {
                req.circle = circle
                next()
            }
        })
}


var processFollowers = function(req, res, next) {
    console.log("Processing followers: " + JSON.stringify(req.body.circles))

    var followerIds = req.body.followers

    if(!_.isArray(followerIds) || followerIds.length === 0) { 
        req.followers = [];
        return next(); 
    }

    var query = { '_id' : { $in : followerIds } }

    User.find(query).select('displayName').exec(function(err, followers) {
        if(err) {
            console.log("no followers")
            req.followers = []
        } else {
            console.log("followers: " + JSON.stringify(followers))
            req.followers = followers
        }
        next()
     })
}

var verifyFollower = function(req, res, next) {
    if(!req.circle || !req.user) {
        next(new Error('Internal error: Required models not loaded.'));
    }
    if(!ac.hasCircleAccess(req.user, req.circle)) {
        return next(new Error('Access denied.'))
    }

    next()
}

var verifyOwner = function(req, res, next) {
    if(!req.circle || !req.user) {
        next(new Error('Internal error: Required models not loaded.'));
    }
    if (req.circle.owner._id.str != req.user._id.str) {
        return next(new Error('Access denied.'))
    }

    next()
}

var defaultFilter = function(circle) {
    var whitelist = ['_id', 'name', 'owner', 'followers', 'created_at'];
    var filterSingle = function(i) { return _.pick(i,whitelist); };

    if(_.isArray(circle)) {
        return _.map(circle, function(i) { return filterSingle(i); });
    } 
    return filterSingle(circle);
} 


// Actions
var index = function (req, res) {
  res.json( defaultFilter(req.circles) );
}

var create = function(req, res){
    var circle = new Circle()
    circle.name = req.body.name
    circle.owner = _.pick(req.user, '_id', 'displayName')
    circle.followers = req.followers

    circle.save( function (err) {
        if(err)  res.json(400, err);
        else res.json(defaultFilter(circle));
    });
}

var update = function(req, res){
    req.circle.name  = req.body.name
    req.circle.followers = req.followers

    req.circle.save( function (err) {
        if(err) res.json(400, err);
        else    res.json(defaultFilter(req.circle));
    });
}

var show = function(req, res) {
  res.json( defaultFilter(req.circle) );
}

var destroy = function(req, res){
    req.circle.remove( function (err) {
        if(err) res.json(400, err)
        else    res.json(204) // Sucess - No Content
    })  
}
