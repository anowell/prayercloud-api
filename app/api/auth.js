var passport = require('passport')

module.exports = function (app, auth) {
    //redirects to FB for authentication
    app.get('/auth/facebook', passport.authenticate('facebook', { display: 'touch' }))
    
    //FB callback after authentication
    app.get('/auth/facebook/callback', 
        passport.authenticate('facebook', { 
            successRedirect: '/',
            failureRedirect: '/?login=failed'
        })
    )

    app.post(  '/api/auth', create)
    app.delete('/api/auth', destroy)

    app.post('/api/login', create)
    app.post('/api/logout', destroy)
}

var create = function(req, res) { 
  res.json(400, new Error('TODO: "CREATE AUTH" (login) API NOT YET IMPLEMENTED.'))
}

var destroy = function(req, res){
  req.logout();
  res.json(204); // Success - No Content
}
