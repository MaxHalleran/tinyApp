# Tiny App - Link Shortener v0.9.0

Tiny App is a full stack web application built with Node and Express that allows users to shorten long url's.

## Final project

This section is currently under development as we're fixing up the last few bugs

## Dependencies

-Node.js
-Express
-EJS
-bcrypt
-body-parser
-cookie-session
-bootstrap

## Getting Started

-Install all dependencies(using the `npm install` command).
-Run the development web server using the `node express_server.js` command or the npm start command.

## Dev log

v0.9.1-Updated the site to better handle cookies with an improper id and increased functionality of page redirection

v0.9.0-Changed the cookies used to session cookies and added password hashing.

## Current focus

-Routing: moving all my routes to a seperate file
-Modules: moving all my server functionality to a seperate file to keep it discrete and clean
-Applying the REST philosophy to the application
-Cookie tracker: a field to keep track of how many (possibly unique) visits a short link has had