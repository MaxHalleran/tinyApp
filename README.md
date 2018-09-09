# Tiny App - Link Shortener v0.9.4

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
-method-override

## Getting Started

-Install all dependencies(using the `npm install` command).
-Run the development web server using the `node express_server.js` command or the npm start command.

## Dev log

v0.9.4-Tested each feature and removed any debugging code left over

v0.9.3-Refactored the server into having Router methods and integrated proper REST protocols

v0.9.2-Cleaned up the code and organized it into seperate, easier to read files and folders.

v0.9.1-Updated the site to better handle cookies with an improper id and increased functionality of page redirection

v0.9.0-Changed the cookies used to session cookies and added password hashing.

## Current focus

-Adding dynamic html error functionality
-Prettying up the program, move the style partial to a css file and properly format the application with bootstrap
-Applying the REST philosophy to the application
-Cookie tracker: a field to keep track of how many (possibly unique) visits a short link has had
-Cookie checking, check the cookie against the database and clear if it isn't present
-error checking, in templateVars add an error field that gets filled in if there's an error