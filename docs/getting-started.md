Table of Contents
-----------------

Getting Started
---------------

Clone prayercloud repo and cd into it.

Download and Install node (version in package.json) - recommend using [nvm](https://github.com/creationix/nvm)

    nvm install v0.11.1
    nvm alias default v0.11.1
    nvm use default

Download & Install mongoDB (v2.4 as of 4/28/13) - [MacOS](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/) | [Linux](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-linux/)

Install PrayerCloud deps

    npm install

Initialize db and start mongod

    mkdir db
    mongod --dbpath db


Start PrayerCloud server

    node app.js

API accessible at http://localhost:3000/api

Note: For lack of completed auth story, you can test the api by first going to: http://localhost:3000/auth/facebook to force a redirect to facebook's login. After it completes, you should be able to see the api working at: http://localhost:3000/api/me

See [API](api.md) wiki page for details.
