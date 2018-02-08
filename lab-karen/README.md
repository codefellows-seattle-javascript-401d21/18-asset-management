## Lab 18 - Asset management

This project uses AWS S3 storage to upload static assets and receive a url that contains the previously uploaded static asset.  It uses AWS secret and public access keys to communicate with AWS S3.

**Installation**
Fork this repository and install on your machine using git clone. Switch to the lab-karen folder.

This project requires Node JS and npm( Node package manager). You will also need a method to create RESTFUL operation statement; a utility like HTTPie or Postman will do this.

The following excerpt from the existing package.json file shows the required package dependencies.
```
"devDependencies": {
  "eslint": "^4.17.0",
  "faker": "^4.1.0",
  "jest": "^22.2.1",
  "jest-cli": "^22.2.1",
  "superagent": "^3.8.2"
},
"dependencies": {
  "aws-sdk": "^2.190.0",
  "bcrypt": "^1.0.3",
  "body-parser": "^1.18.2",
  "cors": "^2.8.4",
  "del": "^3.0.0",
  "dotenv": "^5.0.0",
  "express": "^4.16.2",
  "jsonwebtoken": "^8.1.1",
  "mongoose": "^5.0.3",
  "multer": "^1.3.0"
}
```

Run *npm init* to set up your package.json file. Use *npm i* to install dependancies for (in order)
- express which provides a thin layer of fundamental web application features to create an API
- mongoose which acts as an interface between javascript and Mongo DB
- body-parser which parses incoming request bodies in middleware before your handlers, in the req.body property
- cors for handling cross origin resource sharing
- bcrypt which is a password hashing function
- jsonwebtoken to encode and decode JWT with header and payload and signature
- aws-sdk - a javascript wrapper for aws
- multer - node.js middleware for handling multi-part / form data.


Use *npm i -D* to install developer dependancies for (in order)
- testing
- linting
- for making CRUD requests
- setting up the environment variables
- for debugging the development process
- creating "fake" data for testing.

Additionally, add the following scripts to your package.json file to run from the command line.
```
"scripts": {
  "start": "node index.js",
  "start:watch": "nodemon index.js",
  "start:debug": "DEBUG=http* nodemon index.js",
  "test": "jest -i",
  "test:watch": "jest -i --watchAll",
  "test:debug": "DEBUG=http* jest -i",
  "lint": "eslint .",
  "lint:test": "npm run lint && npm test",
  "start-db": "mkdir -p ./data/db && mongod --dbpath ./data/db",
  "stop-db": "killall mongod"
},
```

**Before making RESTFUL requests**
In the terminal, start the server with the *npm run start:watch* or *npm run start:debug* command. In another terminal window, start the Mongo DB with the command *npm run start-db*.  It may be necessary to shut down the database before starting, if it has been used before.  The command is *npm run stop-db*. In a third window, make the CRUD requests, using HHTPie or Postman.

**Accessing each method**
The CRUD operations can be entered from the CLI using a utility like HTTpie. The format is http CRUD method, the localhost:PORT, the route and the the information be send/updated/deleted from storage.  In these examples, the PORT=3000. **HTTPie** uses the command 'http'.


__To set-up an account:__
```
http POST :3000/api/v1/signup username=karen email='karen@karen.com' password=test
```
Success will create a passwordHash and will send back a authorization token.

__To set-up a gallery:__
```
http POST :3000/api/v1/gallery name=stuff description='place for images' 'Authorization:Bearer TOKEN'
```
where TOKEN is a JSON web token of the form header.payload.signature like 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFhYTM5MGQzZDhjNGU3MzYyYzliOTZlNmM5NDI2ZTE5YTM5N2Y3NDk4MDhkNjY4YzY3Yjc1MWE1NTA5ZWIxZGIiLCJpYXQiOjE1MTgwNTEwMjV9.mu5pXtewHlxiq3Sx1YCcgBkbHaQp1JNCxmrld0CL4Sg'.

__To file upload forms__
```
http -f POST :3000/api/v1/photo image@~/Downloads/test.jpg name='some image' desc='test image for us' galleryId='5a7b9f254df13c391c72d748' 'Authorization:Bearer TOKEN'
```
where the -f indicates an upload of multipart/form data.  In this case the *image@~/Downloads/test.jpg* indicates file type and where the file is locally stored.

__To the URI and key associated with the remotely stored image.__
```
http GET :3000/api/v1/photo/5a7ba7a13917403c6f72572a 'Authorization:Bearer TOKEN'
```


__Server Endpoints__
*/api/v1/photo*
POST request
to upload an image file to S3

*/api/v1/photo/:id*
GET request with id
pass the id of a resource though the url endpoint fetch the URI and key of the object stored in S3

GET request
to retrieve an array of ids for all the files stored in S3

*/api/v1/photo/me*
to retrieve an array of ids for all the files owned associated with the account owner


**Running tests**

For testing, add the following set-up to the package.json file.
```
"jest": {
  "setupFiles": [
    "./__test__/lib/jest-setup.js"
  ],
  "verbose": true,
  "testEnvironment": "node",
  "collectCoverage": true,
  "coverageDirectory": "./coverage",
  "coveragePathIgnorePatterns": [
    "/__test__/"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
},
```
From the command line, type *npm run test:watch* to start testing or *npm run test:debug* to use the debug package.

A series of tests to ensure that your */api/photo* endpoint responds as described for each condition below:
POST /resource - 201 - test that the upload worked and a resource object is returned
POST /resource - 400 - test that the upload requires a valid body of data
POST /resource - 401 - test that the upload requires a Bearer Auth request
GET /resource - 200 - test that the fetch worked and an array of resource IDs are returned
GET /resource/:id - 200 - test that the fetch worked and a resource object is returned
