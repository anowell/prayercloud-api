var User = require('../models/user')
  , authenticateUser = require('../lib/authentication').authenticateUser
  , _ = require('underscore')

var login, me

// Routes
module.exports = function (app, auth) {
	app.get(  '/api/me', authenticateUser, me)
    app.post( '/api/login', authenticateUser, login)
}

// Actions
me = function(req, res) {
	var me = { 
		'_id': req.user.id,
		'displayName' : req.user.displayName 
	};
	res.json(me);
}



login = function(req, res) {
	var mePlusToken = { 
		'_id': req.user.id,
		'displayName' : req.user.displayName,
		'accessToken' : req.user.accessToken
	};
    res.json(mePlusToken);
}