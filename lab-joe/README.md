Joe Waine - lab 18

Testing for get put post delete for gallery items with AWS,
and testing for user signins with bcrypt and json web token

Lib
awss3.js - creates a model - an upload promise


Models
we have an auth model, a gallery model, and a photo model

Routes
corresponding auth, gallery, photo

Description
create an AWS account
create an AWS Access Key and Secret
add the Access Key and Secret to your .env file
create a new model that represents a file type that you want to store on AWS S3
ex: .mp3, .mp4, .png, etc
create a test that uploads one of these files to your route
use the aws-sdk to assist with uploading
use multer to parse the file upload request
Server Endpoint
POST - /api/v1/resource
GET - /api/v1/resource
GET - /api/v1/resource/:resourceID
Tests
POST /resource - 201 - test that the upload worked and a resource object is returned
POST /resource - 400 - test that the upload requires a valid body of data
POST /resource - 401 - test that the upload requires a Bearer Auth request
GET /resource - 200 - test that the fetch worked and an array of resource IDs are returned
GET /resource/:_id - 200 - test that the fetch worked and a resource object is returned
