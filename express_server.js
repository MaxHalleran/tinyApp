var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var path = require('path');
app.use(express.static(path.join(__dirname, 'static')));
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

function validateShortUrl(shortUrl) {
  if (!urlDatabase.hasOwnProperty(`${shortUrl}`)) {
    return urlDatabase[shortUrl];
  } else {
    return validateShortUrl(generateRandomString());
  }
}

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

app.get("/", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
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
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get('/urls/new', (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  res.render('urls_new');
});

app.post('/urls', (req, res) => {
  let tempID = generateRandomString();
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
    username: req.cookies["username"],
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