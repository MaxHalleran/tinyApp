var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var PORT = 8080; //default port 8080

function generateRandomString() {
  let randomID = Math.random().toString(36).substring(2, 8);
  return randomID;
}

app.set("view engine", "ejs");

var urlDatabase = {
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
  res.send('ok');
});

app.get('urls/:id', (req, res) => {
  let templateVars = {
    shortUrl: req.params.id,
    longUrl: urlDatabase[req.params.id]
  };
  res.render('urls_show', templateVars);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});