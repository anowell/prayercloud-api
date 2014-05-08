*Expect to find errors in this doc. This needs a major cleanup*

Auth
----

TBD: Basic process should be something like:

- Authenticate with Facebook (get FB access token)
- Post FB access token to a PrayerCloud API for authenticating (TBD: e.g. /auth/fb)
- PrayerCloud returns a PrayerCloud Access Token (PCAT)
- Embed PCAT in all subsequent requests
- When the PCAT (or FB token expires), request will fail with some authorization required message
- Simply request new FB token, re-auth with PrayerCloud, and begin using new PCAT - should all happen behind the scenes unless the user has revoked FB access to PrayerCloud.


Prayers
-------

Get a list of prayers
 
    GET /prayers
    GET /circles/:id/prayers

Parameters (TBD):

    count: //not yet implemented
    offset: //not yet implemented

Response:

    [
      {
        "author": { id: "1", displayName: "John Doe" },
        "circles": [ 
          { "id": "2", "name": "Community Group" }
        ],
        "msg": "string",
        "created_at": "2013-01-14T02:15:15Z"
      }
    ]

Get a single prayer

    GET /prayers/:id

Response:

    {
      "author": { id: "1", displayName: "John Doe" },
      "circles": [ 
        { "id": "2", "name": "Community Group" }
      ],
      "msg": "string",
      "created_at": "2013-01-14T02:15:15Z"
    }

Create a prayer

    POST /prayers

Input:

    circles=[25,26]
    msg="Prayer request text"

Response:
   
    TBD

Update a prayer request

    PUT /prayers/:id
    PATCH /prayers/:id


Circles
-------
List the authenticated user's prayer circles

    GET /circles

Response:

    [
      {
        "owner": { "id": 1, "displayName": "John Doe" },
        "followers": 
          [ 
            { "id": "2", "displayName": "Jane Doe" } 
          ],
        "created_at": "2013-01-14T02:15:15Z"
      }
    ]


Get a single prayer circle

    GET /circles/:id

Response:

    {
      "name": "Belltown Community Group",
      "owner": { "id": 1, "displayName": "John Doe" },
      "followers": 
        [ 
          { "id": "2", "displayName": "Jane Doe" } 
        ],
      "created_at": "2013-01-14T02:15:15Z"
    }

Create a prayer

    POST /prayers

Input:

    name="Name of group"
    followers=[:id, :id, :id]

Response:
   
    TBD


Update a prayer circle

    PUT /circles/:id
    PATCH /circles/:id


Friends
-------

List PrayerCloud friends

    GET /friends

Response: 

    {
      "id": "1",
      "fb": {
        "displayName": "John Doe"
      }
    },
    {
      "id": "2",
      "fb": {
        "displayName": "Jane Doe"
      }
    }
  ]

Get a single PrayerCloud friend

    GET /friends/:id

    {
      "id": "1",
      "fb": {
        "displayName": "John Doe"
      }
    }

