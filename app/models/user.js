var mongoose = require('mongoose')
  , passport = require('passport')
  , Schema = mongoose.Schema
  , graph = require('fbgraph')
  , _ = require('underscore')


var UserSchema = new Schema({
    accessToken: String,
    displayName : String,
    fb: {
        id: { type: String, unique: true }
    },
    friends : [{
      _id : {type : Schema.ObjectId, ref : 'User'},
      displayName : String
    }],
    created_at  : {type : Date, default : Date.now}
})

UserSchema.statics.findAndUpdateOrCreate = function(accessToken, profile, cb)  {
    var query = { 'fb.id' : profile.id }
    var userAttributes = { 
        'accessToken' : accessToken,
        'displayName': profile.displayName,
        'fb.id' : profile.id
    }

    return this.findOne( query, function(err, doc) {
        if(err || !doc) {
            doc = new User(userAttributes)
            console.log('creating user: ' + doc.fb.id )
            doc.save(cb)
        } else {
            doc.set(userAttributes)
            if( doc.isModified() ) {
                console.log('modifying user: ' + doc.fb.id )
                doc.save(cb)
            } else {
                console.log('unchanged user: ' + doc.fb.id )
                cb(err, doc)
            }
        }
    })
}


UserSchema.statics.updateFriends = function(user, cb) {
  var that = this
  
  console.log("Attempting to update friends cache")
  graph.setAccessToken(user.accessToken)

  //graph.get("/me/friends?fields=installed", function(err, fbRes) {
  //graph can get a list of friends with the installed field, but FQL can filter that result for us in one shot
  graph.fql("SELECT uid FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=me()) AND is_app_user=1", function(err, fbRes) {
    if(err) { 
      console.log("Failed to query FB friends (using cached data): " + JSON.stringify(err))
      return cb(err)
    } else if (!fbRes || !fbRes.data || !fbRes.data.length) { 
      console.log("Presumably no FB friends: " + JSON.stringify(fbRes))
      return cb()
    }

    // Facebook friends using this app
    //console.log("Friend Data: " + JSON.stringify(fbRes.data))
    var fbIds = _.map(fbRes.data, function(u) { return u.uid }) // NOTE: FQL uses "uid" where Graph used "id"

    // Lookup the facebook friends among PrayerCloud users
    var query = {'fb.id' : { $in : fbIds } }
    //console.log("Query for friends in PrayerCloud: " + JSON.stringify(query))
    
    that.find(query).select('displayName').exec(function(err,friends){
      if(err) { 
        return cb(err) 
      }
      if(!friends) { 
        console.log("Found no friends on PrayerCloud.") 
        return cb() 
      }

      //console.log("Friends in PrayerCloud: " + JSON.stringify(friends))
      //var operation = { "$addToSet" : { "friends" : { "$each" : friends } } } 
      var operation = { "$set" : { "friends" : friends } } 
      //console.log("Debug friend caching: " + JSON.stringify(operation))

      user.update(operation, function(err, countt, response) {
        if(err) { 
            console.log("Failed to save friends: " + err)
            return cb(err)
        }
        console.log("Updated friends")
        return cb()
      })

      // TODO: For each friend, append this user as a friend (if not present)
      // friends.update({"$addToSet" : { "friends" : { "id" : user._id, "displayName" : user.displayName } }})

    })
  })
}

var User = mongoose.model('User', UserSchema)
module.exports = User