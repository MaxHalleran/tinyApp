const express = require('express');
const router = express.Router();
const utility = require('./../lib/utility.js');
const urlDatabase = require('./../lib/urlDatabase.js');
const usersDatabase = require('./../lib/usersDatabase.js');
const PORT = 8080; //default port 8080

router.get(".json", (req, res) => {
  res.json(urlDatabase);
});

router.get("/", (req, res) => {
  if (utility.logStatus(req.session)) {
    let templateVars = {
      logStat: utility.logStatus(req.session),
      user_id: utility.setTemplateVars(req.session.user_id, usersDatabase),
      urls: utility.urlsForUser(req.session.user_id, usersDatabase, urlDatabase)
    };
    res.render("urls_index", templateVars);
  } else {
  res.redirect('/login');
}
});

router.get('/new', (req, res) => {
  if (!utility.logStatus(req.session)) {
    res.redirect('/');
  } else {
    let templateVars = {
      logStat: utility.logStatus(req.session),
      user_id: utility.setTemplateVars(req.session.user_id, usersDatabase)
    }
    res.render('urls_new', templateVars);
  }
});

router.post('/new', (req, res) => {
  if (!utility.logStatus(req.session)) {
    res.redirect('/register');
  } else {
    let tempID = utility.validateNumber(utility.generateRandomString(), urlDatabase);
    urlDatabase[tempID] = req.body.longUrl;
    (usersDatabase[usersDatabase.findIndex(u => u.id === req.session.user_id)].collection).push(tempID);
    res.Location = `http://localhost:8080/urls/${tempID}`;
    res.redirect(`http://localhost:${PORT}/urls/${tempID}`);
  }
});

router.post('/:shortUrl/delete', (req, res) => {
  if (utility.logStatus(!req.session)) {
    res.redirect(400, '/');
  }
  if (utility.isOwner(req.params.shortUrl, req.session.user_id, usersDatabase)) {
    let index = usersDatabase[usersDatabase.findIndex(u => u.id === req.session.user_id)].collection.findIndex(e => e === req.params.shortUrl);
    usersDatabase[usersDatabase.findIndex(u => u.id === req.session.user_id)].collection.splice(index, 1);
    delete urlDatabase[req.params.shortUrl];
    res.redirect(`http://localhost:${PORT}/urls`);
  } else {
    res.redirect(400, '/');
  }
});

router.post('/:shortUrl/update', (req, res) => {
  if (utility.isOwner(req.params.shortUrl, req.session.user_id, usersDatabase)) {
    urlDatabase[req.params.shortUrl] = req.body.longUrl;
    res.Location = `http://localhost:${PORT}`;
    res.redirect(`http://localhost:${PORT}`);
  } else {
    res.redirect(400, '/');
  }
});

router.get('/:id', (req, res) => {
  if (!utility.logStatus(req.session)) {
    res.redirect('/');
  } else if (utility.isOwner(req.params.id, req.session.user_id, usersDatabase)) {
    let templateVars = {
      logStat: utility.logStatus(req.session),
      user_id: utility.setTemplateVars(req.session.user_id, usersDatabase),
      shortUrl: req.params.id,
      longUrl: urlDatabase[req.params.id]
    };
    res.render('urls_show', templateVars);
  } else {
    res.redirect('/');
  }
});

module.exports = router;