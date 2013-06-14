// Prayer schema
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var PrayerSchema = new Schema({
//    user       : {type : String, default : '', trim : true}
  author     : {
    _id : {type : Schema.ObjectId, ref : 'User'},
    displayName : String
  },
  circles    : [{
    _id : {type : Schema.ObjectId, ref : 'Circle'},
    name : String
  }],
  msg        : {type : String, default : '', trim : true},
  created_at : {type : Date, default : Date.now}
})

PrayerSchema.path('author._id').validate( function(authorId) {
  return authorId != null
}, 'Prayer author cannot be blank')


PrayerSchema.path('msg').validate( function(msg) {
  return msg && msg.length > 0
}, 'Prayer msg cannot be blank')

PrayerSchema.path('msg').validate( function(msg) {
  return msg.length <= 200
}, 'Prayer msg exceeds 200 characters')


module.exports = mongoose.model('Prayer', PrayerSchema)