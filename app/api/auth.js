var passport = require('passport')

module.exports = function (app, auth) {
    //redirects to FB for authentication
    app.get('/auth/facebook', passport.authenticate('facebook', { display: 'touch' }))
    
    //FB callback after authentication
    app.get('/auth/facebook/callback', 
        passport.authenticate('facebook', { 
            successRedirect: '/',
            failureRedirect: '/login' 
        })
    )

    //app.post('/api/auth', login)
    app.delete('/api/auth', logout)

    // Convenient route aliases
    //app.get('api/login',   login)
    app.get('api/logout',   logout)
}


var logout = function(req, res){
  var pcUrl = req.protocol + '://' + req.get('Host') + '/';
  //var fbLogout = "https://www.facebook.com/logout.php?next=" + pcUrl + "&access_token=" + req.user.accessToken 
  req.logout();
  //res.redirect( fbLogout );
  res.redirect( '/' );
}
