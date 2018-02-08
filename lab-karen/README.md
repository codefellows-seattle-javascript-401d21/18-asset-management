## Lab 18 - Asset management

This project creates bearer authentication middleware for use in route structures.  These authorization routes are tested.

**Installation**
Fork this repository and install on your machine using git clone. Switch to the lab-karen folder.

This project requires Node JS and npm( Node package manager). You will also need a method to create RESTFUL operation statement; a utility like HTTPie or Postman will do this.

Run *npm init* to set up program dependancies. Use *npm i express mongoose body-parser cors bcrypt jsonwebtoken* to install dependancies for (in order)
- express which provides a thin layer of fundamental web application features to create an API
- mongoose which acts as an interface between javascript and Mongo DB
- body-parser which parses incoming request bodies in middleware before your handlers, in the req.body property
- cors for handling cross origin resource sharing
- bcrypt which is a password hashing function
- jsonwebtoken to encode and decode JWT with header and payload and signature.


Use *npm i -D jest eslist superagent dotenv debug faker* to install developer dependancies for (in order)
- testing
- linting
- for making CRUD requests
- setting up the environment variables
- for debugging the development process
- creating "fake" data for testing.

Additionally, add the following scripts to your package.json file
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
The CRUD operations can be entered from the CLI using a utility like HTTpie. The format is http CRUD method, the localhost:PORT, the route and the the information be send/updated/deleted from storage.

__HTTPie__ command http

__PORT__ In these examples, the PORT=4000.

__Server Endpoints__
*/api/v1/gallery*
POST request
pass data as stringifed JSON in the body of a post request to create a new resource

*/api/v1/gallery/:id*
GET request
pass the id of a resource though the url endpoint to req.params to fetch a resource
PUT request
pass data as stringifed JSON in the body of a put request to update a resource
DELETE request
pass the id of a resource though the url endpoint (using req.params) to delete a resource


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

A series of tests to ensure that your */api/gallery* endpoint responds as described for each condition below:
GET - test 200, for a request made with a valid id
GET - test 200, for a request made with no id param
GET - test 401, if no token was provided
GET - test 404, for a valid request with an id that was not found

PUT - test 200, for a post request with a valid body
PUT - test 401, if no token was provided
PUT - test 400, if the body was invalid
PUT - test 404, for a valid request made with an id that was not found

POST - test 201, for a post request with a valid body
POST - test 401, if no token was provided
POST - test 400, if no body was provided or if the body was invalid

DELETE - test 204, for a post request with a valid body
DELETE - test 401, if no token was provided
DELETE - test 404, for a valid request made with an id that was not found
