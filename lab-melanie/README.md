# 18 AWS - S3
This is a program that allows users to create a user account with a username, email, and password, then encrypts the password before saving to the MongoDB. It uses an authenication process to check for valid username and password when signing back in. This program allows a user to add a gallery item associated to their account. The gallery item can be created, read, updated, and deleted. With AWS, this program can now updoad an image to AWS storage and store the url of the image in MongoDB.

## Installing and Getting Started
Fork and git clone this repository to your local computer. Navigate to `lab-melanie` from the terminal and enter `npm install`, this will install all necessary packages to run the program.

You can use HTTPie or Postman to create new users and sign in, I will demonstrate examples with HTTPie:

From the command line, type
```
http POST :3000/api/v1/signup username=<username> password=<password> email=<email>
```
A user is then posted in the database.

To sign in (or GET a record from the database)
```
http -a <username>:<password> :3000/api/v1/signin
```
If the username or password is incorrect, an error message will display.

---

## Data Structures
#### Routes:

`route-auth` contains `POST` and `GET` methods to the database.

`route-gallery` contains `POST`, `GET`, `PUT`, and `DELETE` methods to the database.

`route-photo` contains `POST` and `GET ` methods to AWS and MongoDb.

#### Models:
`auth` creates a user and encrypts the password.

`gallery` creates a gallery item and relates it to the user.

`photo` creates a photo item related to the user and gallery.

---

## Tests
The tests check for valid input recieving valid output, 201 status for `POST` and `200` for `GET`.
The test also check for invalid request returning and expected error status, `404` and `400` for `POST`, `404` and `401` for `GET`.

The gallery tests include:

POST:
* `201` - valid request
* `401` - bad token
* `404` - not found

GET:
* `200` - valid request get all
* `200` - valid request get one
* `401` - bad token
* `404` - not found

PUT:
* `204` - valid request
* `400` - bad request
* `401` - bad token
* `404` - not found

DELETE:
* `204` - valid request
* `401` - bad token
* `404` - not found

The photo tests include:

POST:
* `201` - valid request
* `401` - bad token
* `400` - bad request

GET:
* `200` - valid request to get all
* `200` - valid request to get one by ID
* `401` - bad token
* `404` - not found
