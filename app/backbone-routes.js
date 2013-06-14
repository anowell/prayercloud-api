var fs = require('fs')

// This should be the last route
// It routes all remaining, non-assets to backbone's index.html
module.exports = function (app, auth) {
  app.get("*", skipAssets, routeToBackbone);
}

var routeToBackbone = function(req, res, next){
  console.log(__dirname)
  fs.readFile(__dirname + '/../public/index.html', 'utf8', function(err, text){
      res.send(text);
  });
}

var skipAssets = function(req, res, next) {
  if( req.path.indexOf('/js/') === 0 ||
      req.path.indexOf('/css/') === 0 ||
      req.path.indexOf('/img/') === 0 ) {
    return next('route');
  }
  next();
}