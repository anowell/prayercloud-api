var _ = require('underscore')
  , Prayer = require('../models/prayer')
  , Circle = require('../models/circle')

var loadCircles, findCircles, hasCircleAccess, hasCircleModifyAccess;


// Access Control Routing Middleware
exports.loadCircles = loadCircles = function(req, res, next) {
  var options = {
    select: "name owner followers"
  }
  findCircles(req.user._id, options, function(err, circles) {
    if(err) { return next(err) }
    
    req.circles = circles
    next()
  })
}


exports.findCircles = findCircles = function(userId, options, cb) {
  var userObj = (typeof userId === "string") ? ObjectId(userId) : userId

  var query = { $or : [
    {'followers._id' : userObj},
    {'owner._id' : userObj}
  ] }

  var q =  Circle.find(query)
  q = applyQueryOptions(q, options)

  q.exec( function(err, circles) {
    if(typeof(cb) == 'function') {
      cb(err, circles)
    }
  })
}


exports.hasCircleAccess = hasCircleAccess = function(user, circle) {
  return circle && user && circle.followers.indexOf(user._id) != -1
}

exports.hasCircleModifyAccess = hasCircleModifyAccess = function(user, circle) {
  return circle && user && circle.owner == user._id
}

// exports.hasCircleAccess = hasPrayerAccess = function(user, prayer) {
//   // TODO: verify that prayer.circle populates followers or make an extra query
//   return prayer && user && prayer.circle.followers.indexOf(user.id) != -1
// }

var applyQueryOptions = function(query, options) {
  // Should probably come up with a better way to chain onto acess-based finders
  if(options) {
    if(options.sort)      query = query.sort(options.sort)
    if(options.populate)  query = query.populate(options.sort)
    if(options.select)    query = query.select(options.select)
    if(options.where)     query = query.where(options.where)
    if(options.in)        query = query.in(options.in)
  }
  return query
}