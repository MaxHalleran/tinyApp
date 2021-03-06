const express = require('express');
const bodyParser = require('body-parser');
const PORT = 8080;
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const router = require('./routes/urls.js');
const utility = require('./lib/utility.js');
const urlDatabase = require('./lib/urlDatabase.js');
const usersDatabase = require('./lib/usersDatabase.js');
const methodOverride = require('method-override');
const app = express();

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['suppalightohousegottariot'],
  maxAge: 24 * 60 * 60 * 1000
}));
app.set("view engine", "ejs");

app.use('/urls', router);

app.route('/register')
  .get((req, res) => {
    if (utility.logStatus(req.session)) {
      res.redirect('/');
    }
    let templateVars = {
      logStat: utility.logStatus(req.session),
      user_id: utility.setTemplateVars(req.session.user_id, usersDatabase)
    };
    res.render('register',templateVars);
  })
  .post((req, res) => {
    if ((req.body.email === "" || req.body.username === "" || req.body.password === "") || (usersDatabase.find(u => u.email === req.body.email))) {
      res.redirect('/error/invalidEmail');
    } else {
      let tempID = utility.validateNumber(utility.generateRandomString(), usersDatabase);
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
  if (utility.logStatus(req.session)) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get('/error/:error', (req, res) => {
  let templateVars = {
    logStat: utility.logStatus(req.session),
    user_id: utility.setTemplateVars(req.session.user_id, usersDatabase),
    error: req.params.error
  };
  res.render('error', templateVars);
});

app.route('/login')
  .get((req, res) => {
    if (utility.logStatus(req.session)) {
      res.redirect('/');
    } else {
      let templateVars = {
        logStat: false,
        user_id: false
      };
      res.render('login', templateVars);
    }
  })
  .post((req, res) => {
    let login = utility.validateLogin(req.body.username, req.body.password, usersDatabase);
    if (!login) {
      res.redirect('/error/invalidLogin');
    } else {
      req.session.user_id = login;
      res.redirect('/');
    }
  });

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.get("/u/:shortUrl", (req, res) => {
  let destination = utility.validateRedirect(req.params.shortUrl, urlDatabase);
  res.redirect(`${destination}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
