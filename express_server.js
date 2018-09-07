const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080; //default port 8080
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['suppalightohousegottariot'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

function logStatus(cookies) {
  if (cookies.user_id == undefined) {
    return false;
  } else {
    return true;
  }
}

function generateRandomString() {
  let randomID = Math.random().toString(36).substring(2, 8);
  return randomID;
}

function validateRedirect(shortUrl) {
  if (urlDatabase.hasOwnProperty(`${shortUrl}`)) {
    return urlDatabase[shortUrl];
  } else {
    return `http://localhost:${PORT}/`;
  }
}

function validateNumber(ID, database) {
  if (!validateID(ID, database)) {
    validateNumber(generateRandomString(), database);
  } else {
    return ID;
  }
}

function validateID(ID, database) {
  if (!(database.hasOwnProperty(`${ID}`))) {
    return ID;
  } else {
    return false;
  }
}

function setTemplateVars(cookie) {
  if (cookie === undefined) {
    return false;
  } else {
    return (usersDatabase.find(u => u.id === cookie));
  }
}

function validateLogin(username, password) {
  const realUser = (usersDatabase.find(u => u.username === username)) || '';
  if (realUser === '') {
    return false;
  }
  if (bcrypt.compareSync(password, realUser.password)) {
    return realUser.id;
  }
  return false;
}

function isOwner(shortUrl, ID) {
  let userCollection = (usersDatabase.find(u => u.id === ID)).collection;
  return (userCollection.find(u => u === shortUrl) && true);
}

function urlsForUser(ID) {
  const urlCollection = (usersDatabase.find(u => u.id === ID)).collection;
  let urlpairs = {};
  for (let short of urlCollection) {
    urlpairs[short] = urlDatabase[short];
  }
  return urlpairs;

}

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

const usersDatabase = [
  hxtg7r = {
    id: 'hxtg7r',
    username: 'Max',
    email: 'maxhalleran@gmail.com',
    password: bcrypt.hashSync('google', 10),
    collection: ["b2xVn2", "9sm5xk"]
  }
];

app.get('/register', (req, res) => {
  if (logStatus(req.session)) {
    res.redirect('/');
  }
  let retry = (req.statusCode)
  console.log('Working on register');
  let templateVars = {
    logStat: logStatus(req.session),
    user_id: setTemplateVars(req.session.user_id)
  }
  res.render('register',templateVars);
});

app.post('/register', (req, res) => {
  if ((req.body.email === "" || req.body.username === "" || req.body.password === "") || usersDatabase.find(u => u.email === req.body.email)) {
    res.redirect(400, '/register');
  } else {
    let tempID = validateNumber(generateRandomString(), usersDatabase);
    usersDatabase.push({
      id: tempID,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      collection: []
    });
    req.session.user_id = tempID;
    res.redirect('/urls');
  }
});

app.get("/", (req, res) => {
  if (logStatus(req.session)) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  if (logStatus(req.session)) {
    res.redirect('/');
  } else {
    let templateVars = {
      logStat: false,
      user_id: false
    };
    res.render('login', templateVars);
  }
});

app.post('/login', (req, res) => {
  let login = validateLogin(req.body.username, req.body.password);
  if (!login) {
    res.redirect(403, '/login');
  } else {
    req.session.user_id = login;
    res.redirect('/');
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  if (logStatus(req.session)) {
    let templateVars = {
      logStat: logStatus(req.session),
      user_id: setTemplateVars(req.session.user_id),
      urls: urlsForUser(req.session.user_id)
    };
    res.render("urls_index", templateVars);
  } else {
  res.redirect('/login');
}
});

app.get('/urls/new', (req, res) => {
  if (!logStatus(req.session)) {
    res.redirect('/');
  } else {
    let templateVars = {
      logStat: logStatus(req.session),
      user_id: setTemplateVars(req.session.user_id)
    }
    res.render('urls_new', templateVars);
  }
});

app.post('/urls/new', (req, res) => {
  if (!logStatus(req.session)) {
    res.redirect('/register');
  } else {
    let tempID = validateNumber(generateRandomString(), urlDatabase);
    urlDatabase[tempID] = req.body.longUrl;
    (usersDatabase[usersDatabase.findIndex(u => u.id === req.session.user_id)].collection).push(tempID);
    console.log(usersDatabase[usersDatabase.findIndex(u => u.id === req.session.user_id)].collection);
    res.Location = `http://localhost:8080/urls/${tempID}`;
    res.redirect(`http://localhost:${PORT}/urls/${tempID}`);
  }
});

app.post('/urls/:shortUrl/delete', (req, res) => {
  if (logStatus(!req.session)) {
    res.redirect(400, '/');
  }
  if (isOwner(req.params.shortUrl, req.session.user_id)) {
    let index = usersDatabase[usersDatabase.findIndex(u => u.id === req.session.user_id)].collection.findIndex(e => e === req.params.shortUrl);
    usersDatabase[usersDatabase.findIndex(u => u.id === req.session.user_id)].collection.splice(index, 1);
    delete urlDatabase[req.params.shortUrl];
    res.redirect(`http://localhost:${PORT}/urls`);
  } else {
    res.redirect(400, '/');
  }
});

app.post('/urls/:shortUrl/update', (req, res) => {
  if (isOwner(req.params.shortUrl, req.session.user_id)) {
    urlDatabase[req.params.shortUrl] = req.body.longUrl;
    res.Location = `http://localhost:${PORT}`;
    res.redirect(`http://localhost:${PORT}`);
  } else {
    res.redirect(400, '/');
  }
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.get('/urls/:id', (req, res) => {
  if (!logStatus(req.session)) {
    res.redirect('/');
  } else if (isOwner(req.params.id, req.session.user_id)) {
    let templateVars = {
      logStat: logStatus(req.session),
      user_id: setTemplateVars(req.session.user_id),
      shortUrl: req.params.id,
      longUrl: urlDatabase[req.params.id]
    };
    res.render('urls_show', templateVars);
  } else {
    res.redirect('/');
  }
});

app.get("/u/:shortUrl", (req, res) => {
  let destination = validateRedirect(req.params.shortUrl);
  res.redirect(`${destination}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});