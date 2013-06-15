// Module dependencies.


var express = require('express')
  , res = require('express-resource')
  , fs = require('fs')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , auth = require('./app/lib/authentication')


var app = express();
console.log("Initializing " + app.get('env') + " environment")

var config = require('./config/' + app.get('env'))

mongoose.connect(config.db.uri)
auth.initialize(config)

app.configure( function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('Jesus Christ made Seattle under protest'));
    app.use(express.session());
    app.use(passport.initialize());
    app.use(passport.session());    
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler()); 
});

var bootstrap = function(relpath) {
  var dirpath = path.join(__dirname, relpath)
  var files = fs.readdirSync(dirpath)
  files.forEach( function (file) {
    console.log("bootstrapping " + relpath+'/'+file)
    require(path.join(dirpath,file))(app)
  })
}


bootstrap('/app/models');
bootstrap('/app/api');
require ('./app/backbone-routes')(app);


// Start the app
console.log("Starting express server");
http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
