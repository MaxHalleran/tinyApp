const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const PORT = 8080; //default port 8080
const cookieParser = require('cookie-parser');

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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

app.get("/", (req, res) => {
  let templateVars = { urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get('/urls/new', (req, res) => {
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

app.get('/urls/:id', (req, res) => {
  let templateVars = {
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