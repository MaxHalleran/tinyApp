const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var PORT = 8080; //default port 8080
var cookieParser = require('cookie-parser');
app.use(cookieParser());

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
    return "";
  } else {
    return usersDatabase[cookie.id];
  }
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
    password: 'google'
  }
];

app.get('/register', (req, res) => {
  let retry = (req.statusCode)
  console.log('Working on register')
  let templateVars = {
    user_id: setTemplateVars(req.cookies.user_id)
  }
  res.render('register',templateVars);
});

app.post('/register', (req, res) => {
  if ((req.body.email === "" || req.body.username === "" || req.body.password === "") || usersDatabase.find(u => u.email === req.body.email)) {
    res.redirect(400, '/register');
  } else {
    let tempID = validateNumber(generateRandomString(), usersDatabase);
    usersDatabase[tempID] = {
      id: tempID,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }
      res.cookie('user_id', usersDatabase[tempID]);
      res.redirect('/urls');
  }
});

app.get("/", (req, res) => {
  let templateVars = {
    user_id: setTemplateVars(req.cookies.user_id),
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user_id: setTemplateVars(req.cookies.user_id)
  };
  res.render("urls_index", templateVars);
});

app.get('/urls/new', (req, res) => {
  let templateVars = {
    user_id: setTemplateVars(req.cookies.user_id)
  };
  res.render('urls_new', templateVars);
});

app.post('/urls', (req, res) => {
  let tempID = validateNumber(generateRandomString(), urlDatabase);
  urlDatabase[tempID] = req.body.longUrl;
  res.statusCode = 302;
  res.Location = `http://localhost:8080/urls/${tempID}`;
  res.redirect(`http://localhost:${PORT}/urls/${tempID}`);
});

app.post('/urls/:shortUrl/delete', (req, res) => {
  delete urlDatabase[req.params.shortUrl];
  res.redirect(`http://localhost:${PORT}/urls`);
});

app.post('/urls/:shortUrl/update', (req, res) => {
  urlDatabase[req.params.shortUrl] = req.body.longUrl;
  res.statusCode = 302;
  res.Location = `http://localhost:${PORT}`;
  res.redirect(`http://localhost:${PORT}`);
});

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get('/urls/:id', (req, res) => {
  let templateVars = {
    user_id: setTemplateVars(req.cookies.user_id),
    shortUrl: req.params.id,
    longUrl: urlDatabase[req.params.id]
  };
  res.render('urls_show', templateVars);
});

app.get("/u/:shortUrl", (req, res) => {
  let destination = validateRedirect(req.params.shortUrl);
  res.redirect(`${destination}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});