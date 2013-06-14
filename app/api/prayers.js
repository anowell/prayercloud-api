var Prayer = require('../models/prayer')
  , authenticateUser = require('../lib/authentication').authenticateUser
  , ac = require('../lib/access-control')
  , _ = require('underscore')

var loadPrayer, publicFilter, verifyAuthor, verifyCircles;
var index, create, show, update, destroy;

// Routes
module.exports = function (app, auth) {
    app.get( '/api/prayers',     authenticateUser, ac.loadCircles, index)
    app.post('/api/prayers',     authenticateUser, processCircles, create)
    app.get( '/api/prayers/:id', authenticateUser, loadPrayer, show)
    app.put( '/api/prayers/:id', authenticateUser, loadPrayer, verifyAuthor, processCircles, update)
    app.del( '/api/prayers/:id', authenticateUser, loadPrayer, verifyAuthor, destroy)
}

loadPrayer = function(req, res, next) {
    Prayer.findById(req.params.id)
        //.populate('user')
        .exec( function(err, prayer) {
            if (err) next(err)
            else if (!prayer) next(new Error('Failed to load prayer ' + req.params.id))
            else {
                req.prayer = prayer
                next()
            }
        })
}

processCircles = function(req, res, next) {
    console.log("Processing circles: " + JSON.stringify(req.body.circles))

    var circleIds = req.body.circles

    if(!_.isArray(circleIds) || circleIds.length === 0) { 
        req.circles = [];
        console.log("no circles in request body")
        return next(); 
    }

     var options = {
        select: "name",
        where: "_id",
        in: circleIds
     }

     ac.findCircles(req.user, options, function(err, circles) {
        if(err) {
            console.log("no circles found with query")
            req.circles = []
        } else {
            console.log("using circles: " + JSON.stringify(circles))
            req.circles = circles
        }
        next()
     })
}

verifyAuthor = function(req, res, next) {
    if(!req.prayer || !req.user) {
        next(new Error('Internal error: Required models not loaded.'));
    }
    if (req.prayer.author._id.str != req.user._id.str) {
        return next(new Error('Access denied.'))
    }
    next()
}

defaultFilter = function(prayer) {
    var whitelist = ['_id', 'author', 'msg', 'circles', 'created_at'];
    var filterSingle = function(p) { return _.pick(p,whitelist); };

    if(_.isArray(prayer)) {
        return _.map(prayer, function(p) { return filterSingle(p); });
    } 
    return filterSingle(prayer);
} 

// Actions
index = function(req, res) {
    var asAuthor = { 'author._id' : req.user._id };
    var asFollower = { 'circles' : { $elemMatch : { _id : { $in : req.circles }}}}

    var query = { $or : [ asAuthor, asFollower ] }

    Prayer.find(query, function (err, prayers) {
        if(err) res.json(400, err);
        else    res.json(defaultFilter(prayers));
    });
};

create = function(req, res) {
    var prayer = new Prayer();
    prayer.msg = req.body.msg
    prayer.circles = req.circles;
    prayer.author = {
        _id : req.user._id,
        displayName : req.user.displayName
    }

    prayer.save( function (err) {
        if(err) res.json(400, err);
        else    res.json(defaultFilter(prayer));
    })
}

show = function(req, res) {
    res.json(defaultFilter(req.prayer));
}

update = function(req, res) {
    var prayer = req.prayer;
    prayer.msg = req.body.msg;
    prayer.circles = req.circles;

    prayer.save( function (err) {
        if(err) res.json(400, err);
        else    res.json(defaultFilter(prayer));
    })
}

destroy = function(req, res) {
    req.prayer.remove( function (err, prayer) {
        if(err) res.json(400, err)
        else    res.json(204) // Sucess - No Content
    })
}