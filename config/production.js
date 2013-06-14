module.exports = {
  db: {
    uri:        process.env.MONGOLAB_URI
  },
  facebook: {
    appId:      process.env.FACEBOOK_APP_ID,
    appSecret:  process.env.FACEBOOK_SECRET,
    hostUri:    "http://prayercloud.herokuapp.com"
  }
}