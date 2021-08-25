<br/>
<p align="center">
  <a href="https://github.com/jenkins96/myapirest">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">REST API</h3>

  <p align="center">
    An Awesome ReadME Generator To Jumpstart Your Projects!
    <br/>
    <br/>
    <a href="https://github.com/jenkins96/myapirest"><strong>Explore the docs »</strong></a>
    <br/>
    <br/>
    <a href="https://github.com/jenkins96/myapirest">View Demo</a>
    .
    <a href="https://github.com/jenkins96/myapirest/issues">Report Bug</a>
    .
    <a href="https://github.com/jenkins96/myapirest/issues">Request Feature</a>
  </p>
</p>




## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Authors](#authors

## About The Project

![Screen Shot](images/screenshot.png)

This is a backend CRUD REST API project.
Here, you can create a user, and once you are logged in, you will be able to interact with the API and do CRUD operations with 'slides', 'galeries', 'articles' and 'admins'.

The project has the following routes:
**Admins:**
```sh
localhost:3000/admins/get-admins                [Authenthication needed]
localhost:3000/admins/create-admin
localhost:3000/admins/edit-admin/:id            [Authenthication needed]
localhost:3000/admins/delete-admin/id           [Authenthication needed]
localhost:3000/admins/login                     [Token Generation]
```
**Slides:**
```sh
localhost:3000/slides/get-slides
localhost:3000/slides/create-slide              [Authenthication needed]
localhost:3000/slides/edit-slide/:id            [Authenthication needed]
localhost:3000/slides/delete-slide/:id          [Authenthication needed]
```
**Galeries:**
```sh
localhost:3000/galeries/get-galeries
localhost:3000/galeries/create-galery              [Authenthication needed]
localhost:3000/galeries/edit-galery/:id            [Authenthication needed]
localhost:3000/galeries/delete-galery/:id          [Authenthication needed]
```
**Articles:**
```sh
localhost:3000/articles/get-articles
localhost:3000/articles/create-article              [Authenthication needed]
localhost:3000/articles/edit-article/:id            [Authenthication needed]
localhost:3000/articles/delete-article/:id          [Authenthication needed]
```

## Structure Of The Project
```bash
├───archives
│   ├───articles
│   ├───galery
│   └───slide
├───config
├───controllers
├───middlewares
├───models
├───node_modules
└───routes
```


## Built With

* Node.js
* JavaScript
* Express
* Bcrypt
* JsonWebToken
* Mongoose
* MongoDB
* Nodemon

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

**Create a Database in MongoDB with the following collections:**
* admins: user and password
* articles: cover, title, intro, url and content
* galeries: photo
* slides: image, title and description 

### Installation

1. Clone the repo:

```sh
git clone https://github.com/jenkins96/myapirest
```

2. Navigate to directory where the repository was cloned and install NPM packages:

```sh
npm install
```

3. Configure your connection with MongoDB in `db.config.js`



## Usage
1. A user need to be created. Model demands 'user' and 'password'.
Example:
```sh
{
  "user": "admin",
  "password": "admin"
}
localhost:3000/admins/create-admin
```
2. Need to get a token for accessing protected routes. Send credentials for newly created user and save the token that it will return.
Example:
```sh
{
  "user": "admin",
  "password": "admin"
}
localhost:3000/admins/login
Save the returned token!
```
3. Let's say you want to create an article, which demands: 'title', 'intro', 'url', 'content' and a file (.png or .jpeg only).
Example:
```sh
Authorization: '<Generated token>'
File!
{
"title": "Title",
"intro": "Intro",
"url": "URL",
"content": "Content"
}

localhost:3000/articles/create-article
```

There are some routes where no authenthication is neededed.
Tokens generated last for 30 days. It can be modify in './config/config.js' 

## Authors

* **Adrián Jenkins** - ** - [Adrián Jenkins](https://github.com/jenkins96) - 

