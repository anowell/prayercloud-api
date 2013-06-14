var User = require('../models/user')
  , authenticateUser = require('../lib/authentication').authenticateUser
  , _ = require('underscore')

var jsonApi
var index

// Routes
module.exports = function (app, auth) {
    app.get( '/api/friends', authenticateUser, index)
}


// Actions
index = function(req, res) {

    var regex = new RegExp(req.query.term, "i")
    var query = {
        '_id' : { $in : req.user.friends },
        'displayName': { $regex : regex }
    }

    User.find(query).select('displayName').exec(function (err, users) {
        if(err) { throw err }

        // if(req.query.src == 'jq') {
        //     res.json(_.map(users, function(u) {
        //         return {
        //             value: u.id,
        //             label: u.displayName
        //         }
        //     }))
        // }
        // else {
             res.json(users)
        //}
    })
}