# Lab 18 ~ Asset Management

**Author**: Mitchell
**Version**: 1.0.0

## Overview
This lab is focused on utilizing AWS (Amazon Web Services) and their S3 service (cloud file storage/hosting), in addition to basic/bearer authorization. We need to incorporate new middleware to convert images to a readable stream and send that to S3 for storage. On success, S3 will return data about the stored file, and we need to store that information and a URI reference to the stored image in MongoDB. We need to add a new `route-photo.js` to the `route/` directory

## Getting Started
To get this application up and running, fork and/or clone this repository using the `git clone <git repository link>` command in your terminal. Next, run the `npm install` command, which will install all the necessary dependencies in the accompanying package.json file. If wanting to view tests, enter `npm install -D` into the command line. After those packages have installed, you can run `npm test` to explore the included tests and functionality of their respective solutions. You can open up the code in your favorite editor to explore/modify the code, see how the tests are structured, and create tests of your own if desired. `npm run test:debug` will allow for the use of the `debug` package if dev-dependencies have been installed. Downloading and installing `MongoDB` (see links below) and entering the command `npm run start-db` will initiate the database required for complete functionality.

## Description
### Server
This file `server.js` in the `lib/` directory is home to the application's server control. It also requires in the `errorHandler` custom middleware. It exports a `server` object to use elsewhere in the application. There are two functions attached to this object, `server.start()` and `server.stop()`, to be used in the `index.js` entry point as well as test files.

### Routes
**Route-auth**
The `route/` directory contains a file, `route-auth.js`, which exports a single anonymous function expecting a single `router` argument. The exported file has CRUD methods mounted on the router to the `/signup` and `/signin` endpoints. `POST` incorporates the `body-parser` middleware for the purposes described above. `GET` incorporates the custom `basicAuth` middleware to validate authorization for retreival of information.

**Route-gallery**
The `route/` directory contains a file, `route-gallery.js`, which exports a single anonymous function expecting a single `router` argument. The exported file has CRUD methods mounted on the router to the `/gallery/:_id?` endpoint. All of the CRUD methods include both the `bearerAuth` custom middleware to validate authorization, and all but `DELETE` utilize the `bodyParser` middleware.

**Route-photo**
The `route/` directory contains a file, `route-photo.js`, which exports a single anonymous function expecting a single `router` argument. The exported file has CRUD methods mounted on the router to the `/gallery/:_id?` endpoint. Both the `GET` and `POST` CRUD methods use the `bearerAuth` custom middleware to validate authorization, and only the `POST` utilizes the `bodyParser` middleware.

### Model
**Auth**
The `model/` directory contains a `Schema`, `auth.js`, which exports a `mongoose` model to store in the DB. It has `username`, `password`, `email`, and `compareHash` properties which are all required except for that last, and values are expected to be in the form of strings. There are 4 methods attached to the `Auth` schema:
* `generatePasswordHash(password)` expects a single password argument, and utilizes `bcrypt` to hash and store a reference to the original password entered by the user. This allows the application to toss the original plain-text password, and store only the hash. If there is no password passed as an argument, the method will return a Promise rejection passing on an `Authorization` error.
* `comparePasswordHash(password)` expects a single password argument, and utilizes `bcrypt` to compare a stored password hash for an `Auth` schema instance with the password supplied in an HTTP request. If the password hashes match, it will return a Promise resolve and allow the application to proceed. If `bcrypt` does not return `valid` as the result of the comparison, the function will reject a new `Authorization` error.
* `generateCompareHash()` expects no arguments, and uses `crypto` to generate and save a compareHash to be stored on the `Auth` instance as the value of the property on the schema.
* `generateToken()` expects no arguments, and uses `jwt` to create and return a token to the user that will accompany future requests in the same session of the application.

**Gallery**
The `model/` directory a contains a `Schema`, `gallery.js`, which exports a `mongoose` model to store in the DB. It has `name`, `description`, and `userId` properties which are all required.

**Photo**
The `model/` directory a contains a `Schema`, `photo.js`, which exports a `mongoose` model to store in the DB and AWS-S3. It has `name`, `description`, `userId`, `galleryId`, `objectKey` and `imageURI` properties, all of which are required. The last two also need to be unique. It has a single static method attached to the `Schema`.
* `upload(req)` expects a single `req` parameter, and returns a new `Promise` that uploads a photo utilizing `fs` and `awsS3` to the AWS S3 service.

### Middleware
**AWS-S3**
The file `aws-s3.js` in the `lib/` directory contains a single anonymous function on the exported `uploads` object, expecting a single `params` argument. It returns a new `Promise` and utilizes the `s3.upload()` method from the `aws-sdk` package. 

**Basic-Auth-Middleware**
The file `basic-auth-middlware.js` in the `lib/` directory exports a single anonymous function expecting three arguments, `req`, `res`, and `next`. It validates that there are authorization headers accompanying HTTP requests, as well as the presence of both `username` and `password` information sent along in those headers. On success, it calls next at the end of the function to continue the processing of the request. 

**Bearer-Auth-Middleware**
The file `bearer-auth-middlware.js` in the `lib/` directory exports a single anonymous function expecting three arguments, `req`, `res`, and `next`. It validates that there are authorization headers accompanying HTTP requests, as well as the presence of a `JWT` token. It utilizes `jwt` to verify the token with respect to the `APP_SECRET` environment variable, and if that passes it will call `findOne()` on the `Auth` schema to locate the schema with a matching `compareHash` property to the verified token. If none are found, it will return an authorization error, `401`, and on success it will call `next()`.

**Error-handler**
The file `error-handler.js` in the `lib/` directory exports a single anonymous function expecting two arguments, `err` and `res`. It has a number of switch cases, which respond with different status codes depending on the text of the error message they receive. 


## Credits and Collaborations
* [AWS-SDK Docs](https://aws.amazon.com/documentation/sdk-for-javascript/) ~ https://aws.amazon.com/documentation/sdk-for-javascript/
* [Bcrypt Docs](https://www.npmjs.com/package/bcrypt) ~ https://www.npmjs.com/package/bcrypt
* [Body Parser Docs](https://www.npmjs.com/package/body-parser) ~ https://www.npmjs.com/package/body-parser
* [Cors Docs](https://www.npmjs.com/package/cors) ~ https://www.npmjs.com/package/cors
* [Crypto Docs](https://nodejs.org/api/crypto.html) ~ https://nodejs.org/api/crypto.html
* [Del Docs](https://www.npmjs.com/package/del) ~ https://www.npmjs.com/package/del
* [Dotenv Docs](https://www.npmjs.com/package/dotenv) ~ https://www.npmjs.com/package/dotenv
* [ESLint Docs](https://www.npmjs.com/package/eslint) ~ https://www.npmjs.com/package/eslint
* [Express Docs](http://expressjs.com/en/4x/api.html) ~ http://expressjs.com/en/4x/api.html
* [Jest Docs](https://facebook.github.io/jest/) ~ https://facebook.github.io/jest/
* [JWT - JSON Web Token Docs](https://www.npmjs.com/package/jsonwebtoken) ~ https://www.npmjs.com/package/jsonwebtoken
* [MongoDB](https://docs.mongodb.com/) ~ https://docs.mongodb.com/
* [Mongoose Docs](http://mongoosejs.com/docs/guide.html) ~ http://mongoosejs.com/docs/guide.html
* [Multer Docs](https://www.npmjs.com/package/multer) ~ https://www.npmjs.com/package/multer
* [Path Docs](https://nodejs.org/api/path.html) ~ https://nodejs.org/api/path.html