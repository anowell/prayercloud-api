PrayerCloud-API
===============

PrayerCloud was a back-burner project that had to be put aside to focus on some other projects. I hope to return to it someday, but in the meantime I'm parking it here on the chance of finding contributors who might share a similar vision.

PrayerCloud-API is the RESTful mongo-backed JSON API leveraged by [PrayerCloud-Web](https://github.com/anowell/prayercloud-web). Disclaimer: it was my first stab at NodeJS/Mongo, parts of the API aren't complete, and it lacks tests.


Getting Started
---------------

    npm install
    mongod --dbpath path_to_db
    node app.js

API now accessible at: `http://localhost:3000/api/`

Detailed [getting started guide](https://bitbucket.org/anowell/prayercloud-api/wiki/Home) available on the wiki.

API
---------------

The PrayerCloud API aims to be RESTful:
    
    # (I)ndex, (C)reate, (R)ead, (U)pdate, (D)estroy

    /api/auth       # Authentication (CD)
    /api/prayers    # Prayer Requests (ICRUD)
    /api/circles    # Prayer Circles (ICRUD)
    /api/friends    # Friends (I)
    /api/me         # Logged in user (R)

Detailed [API Documentation](https://bitbucket.org/anowell/prayercloud-api/wiki/API) available on the wiki.

Developer Tip
-------------

To monitor PrayerCloud-Api for changes, automatically restarting the node server

Install grunt: `npm install grunt-cli -g`

Start nodemon: `grunt`
