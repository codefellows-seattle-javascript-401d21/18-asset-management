# Lab 18: Asset Management

This app is an Express HTTP server that has bearer authentication middleware and uses AWS for file storage

It uses a Mongo DB with 3 schemas:

The server has the following endpoints

/api/signup
POST request
the client should pass the username and password in the body of the request
the server should respond with a token (generated using jwt)
the server should respond with 400 Bad Request to a failed request

/api/signin
GET request
the client should pass the username and password to the server using a Basic: authorization header
the server should respond with a token for authenticated users
the server should respond with 401 Unauthorized for non-authenticated users

/api/gallery

/api/photo

To install the app clone the git repository

The dependencies are:

aws-sdk
bcrypt
body-parser
cors
crypto
del
dotenv
express
jsonwebtoken
mongoose
multer

Install them using 'npm i' command

The developer dependecies are:

jest
superagent
debug
faker

To install: NPM i -D 'dependency name'.
To get debug messages use: npm run start:debug

To start Mogono DB: mongod --dbpath ./data/db

To start server: npm run start:watch

Use Postman or httpie to make a request.

Below are sample requests and responses using httpie:

Create new user
http POST :3000/api/v1/signup username=zHulk email='hulk@m.com' password=1

HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 293
Content-Type: application/json; charset=utf-8
Date: Thu, 08 Feb 2018 05:47:13 GMT
ETag: W/"125-opWWhjhfYGhnuEMFWNtWSqxbYjQ"
X-Powered-By: Express

"token"

Post a Gallery
http POST :3000/api/v1/gallery name='my gallery' description='it is a thing' 'Authorization:Bearer token'

HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 128
Content-Type: application/json; charset=utf-8
Date: Thu, 08 Feb 2018 05:53:01 GMT
ETag: W/"80-MLRwqUuj2OQPS+VbeKdMDeKyQqw"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "5a7be5bdaa190c144210a084",
    "description": "it is a thing",
    "name": "my gallery",
    "userId": "5a7be461aa190c144210a083"
}

File upload to aws
http -f POST :3000/api/v1/photo image@~/Documents/cfLab/test.png name=test desc='ice' galleryId='5a7be5bdaa190c144210a084' 'Authorization:Bearer token'

HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 280
Content-Type: application/json; charset=utf-8
Date: Thu, 08 Feb 2018 06:52:36 GMT
ETag: W/"118-lk8tiHFU2LpITcTp+lydBJTPAxA"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "5a7bf3b4dede5a1ae2983b59",
    "desc": "ice",
    "galleryId": "5a7be5bdaa190c144210a084",
    "imageURI": "https://401d21-ea.s3.amazonaws.com/3834578a7b3c1484d23f1fc25ab86d39.png",
    "name": "test",
    "objectKey": "3834578a7b3c1484d23f1fc25ab86d39.png",
    "userId": "5a7be461aa190c144210a083"
}

Colloaorator(s):
