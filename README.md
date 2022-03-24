# members-only


Live preview of website: https://members-only-web.herokuapp.com/

# Table of contents

1. [Introduction](#introduction)
2. [Technologies Used](#paragraph1)
3. [Features](#features-paragraph)
4. [Screenshots](#screenshot)
5. [Setup](#setup-paragraph)
6. [Project Status](#status-paragraph)
7. [Room for improvements](#imporvements-paragraph)
8. [Acknowledgements](#Acknowledgements-paragraph)
9. [Contact](#contact-paragraph)

## Introduction <a name="introduction"></a>

This is a server side web application which is used for members to create an account and create posts. Non-members can only view posts 

## Technologies Used <a name="paragraph1"></a>

1. Nodejs
2. Expressjs
3. mongoDb
4. EJS
5. Git version control
6. Github
7. Passportjs

## Features <a name="features-paragraph"></a>

1. Ability to create an account and log in and log out 
2. Hashing of passwords in database using the bcrypt hashing algorithm
3. Different permissions based on whether the user is a member or not 
4. Ability to create posts if user is a member 

## Screenshots <a name="screenshot"></a>

<img src="./public/homepage.png" width="128"/>
<img src="./public/items.png" width="128"/>
<img src="./public/categorypage.png" width="128"/>
<img src="./public/form.png" width="128"/>
## Setup <a name="setup-paragraph"></a>

Project Dependancies are listed in the package.json file: package.json

First clone the repo

```
git clone https://github.com/a-sha0234/food-inventory-app.git
```

Run the following command in the command line:

```
npm install
```

Then to start the application:

```
npm start
```

or if using nodemon run:

```
nodemon server
```

## Status <a name="status-paragraph"></a>

Finsihed, as all features has been implemented

## Room for improvements <a name="imporvements-paragraph"></a>

Room for improvement:

1. create a strong password feature that forces the user to have at least one capital letter and one symbol in their password 

## Acknowledgements <a name="Acknowledgements-paragraph"></a>

This project was inspired by the odin project

## Contact <a name="Contact-paragraph"></a>

Created by Arun Sharma, feel free to contact me
