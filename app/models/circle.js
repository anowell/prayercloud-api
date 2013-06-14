// Circle schema
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require("underscore")

var CircleSchema = new Schema({
  name          : {type : String, default : '', trim : true}
  , owner       : {
      _id : {type : Schema.ObjectId, ref : 'User'},
      displayName : String
    }
  , followers   : [{
      _id : {type : Schema.ObjectId, ref : 'User'},
      displayName : String
    }]
  , created_at  : {type : Date, default : Date.now}
})

CircleSchema.path('name').validate( function(name) {
  return name.length > 0
}, 'Circle name cannot be blank')

CircleSchema.path('name').validate( function(name) {
  return name.length < 32
}, 'Circle name too long')

CircleSchema.pre('save', function(next) {
  // If modifying followers array, remove duplicates
  if(this.isModified('followers')) {
    this.followers = _.uniq(this.followers)
  }
  next()
})


module.exports = mongoose.model('Circle', CircleSchema)