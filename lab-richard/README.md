<h1>18-Asset-Management</h1>

Author: Richard Montgomery
Git: montgomeryrd
Version: 1.0.0
Last Modified: 02/09/2018 3:00am

<h2>Server Endpoints</h2>

/api/v1/signup [POST] - Register User: requires username, email, password
/api/v1/signin [GET] - User verification
/api/v1/gallery/ [GET] - Retrieve a list of the galleries
/api/v1/gallery/ [GET] - Retrieve a gallery object
/api/v1/gallery/ [PUT] - Requires id to send a request and update a gallery object
/api/v1/gallery/ [DELETE] - Requires id to delete a gallery object
/api/v1/gallery/ [POST] - Uses the send request to create a gallery object
/api/v1/photo/ [GET] - Retrieves a photo object
/api/v1/photo/ [POST] - Requires name, desc, userId, and galleryId to create a photo object
/api/v1/photo/ [PUT] - Uses name, desc, userId, and galleryId to update a photo object
/api/v1/photo/ [DELETE] - Requires id to delete a photo object

<h2>Lab README</h2>

![CF](https://camo.githubusercontent.com/70edab54bba80edb7493cad3135e9606781cbb6b/687474703a2f2f692e696d6775722e636f6d2f377635415363382e706e67) 18: Image Uploads w/ AWS S3
===

## Submission Instructions
  * fork this repository & create a new branch for your work
  * write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-susan`
  * push to your repository
  * submit a pull request to this repository
  * submit a link to your PR in canvas
  * write a question and observation on canvas

## Learning Objectives
* students will be able to upload static assets to AWS S3
* students will be able to retrieve a cdn url that contains the previously uploaded static asset
* students will be able to work with secret and public access keys

## Requirements
#### Configuration
* `package.json`
* `.eslintrc`
* `.gitignore`
* `README.md`

#### Description
* create an AWS account
* create an AWS Access Key and Secret
  * add the Access Key and Secret to your `.env` file
* create a new model that represents a file type that you want to store on AWS S3
  * ex: `.mp3`, `.mp4`, `.png`, etc
* create a test that uploads one of these files to your route
* use the `aws-sdk` to assist with uploading
* use `multer` to parse the file upload request

#### Server Endpoint
* `POST` - `/api/v1/resource`
* `GET` - `/api/v1/resource`
* `GET` - `/api/v1/resource/:resourceID`


#### Tests
* `POST /resource` - **201** - test that the upload worked and a resource object is returned
* `POST /resource` - **400** - test that the upload requires a valid body of data
* `POST /resource` - **401** - test that the upload requires a Bearer Auth request
* `GET /resource` - **200** - test that the fetch worked and an array of resource IDs are returned
* `GET /resource/:_id` - **200** - test that the fetch worked and a resource object is returned

#### Stretch
* `DELETE` route - `/api/v1/resource/:resourceID`
* Test: `DELETE` - **204** - test to ensure the object was deleted from s3 and from your database

* try using the `deleteObject` method provided by the `aws-sdk` to delete an object *(file)* from S3
  * you will need to pass in a `params` object that contains the associated Bucket and AWS object key in order to delete the object from s3
  * ex:
  ``` javascript
  var params = {
    Bucket: 's3-bucket-name',
    Key: 'object-filename'
  }
  s3.deleteObject(params)
  ```
