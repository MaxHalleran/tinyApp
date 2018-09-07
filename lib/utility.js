const urlDatabase = require('./urlDatabase.js');
const usersDatabase = require('./usersDatabase.js');
const bcrypt = require('bcrypt');
const PORT = 8080; //default port 8080

exports.logStatus = function(cookies) {
  if (cookies.user_id == undefined) {
    return false;
  } else {
    return true;
  }
}

exports.generateRandomString = function() {
  let randomID = Math.random().toString(36).substring(2, 8);
  return randomID;
}

exports.validateRedirect = function(shortUrl, urlDatabase) {
  if (urlDatabase.hasOwnProperty(`${shortUrl}`)) {
    return urlDatabase[shortUrl];
  } else {
    return `http://localhost:${PORT}/`;
  }
}

exports.validateID = function(ID, database) {
  if (!(database.hasOwnProperty(`${ID}`))) {
    return ID;
  } else {
    return false;
  }
}

exports.validateNumber = function(ID, database) {
  if (!this.validateID(ID, database)) {
    validateNumber(generateRandomString(), database);
  } else {
    return ID;
  }
}

exports.setTemplateVars = function(cookie, usersDatabase) {
  if (cookie === undefined) {
    return false;
  } else {
    return (usersDatabase.find(u => u.id === cookie));
  }
}

exports.validateLogin = function(username, password, usersDatabase) {
  const realUser = (usersDatabase.find(u => u.username === username) || '');
  if (realUser === '') {
    return false;
  }
  if (bcrypt.compareSync(password, realUser.password)) {
    return realUser.id;
  }
  return false;
}

exports.isOwner = function(shortUrl, ID, usersDatabase) {
  let userCollection = (usersDatabase.find(u => u.id === ID).collection);
  return (userCollection.find(u => u === shortUrl) && true);
}

exports.urlsForUser = function(ID, usersDatabase, urlDatabase) {
  const urlCollection = usersDatabase.find(u => u.id === ID).collection;
  let urlpairs = {};
  for (let short of urlCollection) {
    urlpairs[short] = urlDatabase[short];
  }
  return urlpairs;
}