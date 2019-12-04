var express = require('express');
var router = express.Router();
const v4 = require('node-uuid').v4;
const jwt = require('jsonwebtoken');
var User = require('../models/user');
var Question = require('../models/question');


router.post('/registry', (req, res, next) => {

  req.check('email', 'Please enter a valid email').len(1).isEmail();
  req.check('password', 'Please enter a password with a length between 6 and 20 digits').len(6, 20);

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({errors})
  } else {
    User.hashPassword(req.body.password, (err, passwordHash) => {
      if (err) {
        return res.status(400).json({error: err.message})
      }

      const userObj = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      userObj.passwordHash = passwordHash;
      User.findOne({name: req.body.name}, (err, user) => {
        if (user) {
          return res.status(400).json({error: 'This name already exist. Please, change it'})
        }
        User.findOne({email: req.body.email}, (err, user) => {
          if (user) {
            return res.status(400).json({error: 'This email already exist. Please, change it'})
          }
          userObj.save((err, item) => {
            if (err) {
              return res.status(400).json({error: err.message})
            }
            res.status(200).send();
          })
        });
      });
    });
    }
});

/* GET users listing. */
router.post('/login', function(req, res, next) {
  req.check('email', 'Please enter a valid email').len(1).isEmail();
  req.check('password', 'Please enter a password with a length between 6 and 20 digits').len(6, 20);

  const errors = req.validationErrors();
  const password = req.body.password;

  if (errors) {
    return res.status(400).json({ errors })
  } else {
    User.findOne({email: req.body.email}, (err, user) => {
      if (err) {
        return res.status(400).json({error: err.message})
      }
      if (!user) {
        return res.status(400).json({error: 'User not found'})
      }
      // if (user.password !== password) {
      //   return res.status(400).json({ error: 'Wrong password' })
      // }
      User.comparePasswordAndHash(password, user.passwordHash, (err, areEqual) => {
        if (err) {
          return res.status(400).json({error: err.message})
        }
        if (!areEqual) {
          return res.status(400).json({error: 'Wrong password'})
        }
        const payload = {
          // _id: user._id,
          iss: 'http://localhost:3000'
          // permissions: 'poll',
        };
        const options = {
          expiresIn: '7d',
          jwtid: v4(),
        };
        const secret = "SecretStringForDummies";
        jwt.sign(payload, secret, options, (err, token) => {
          return res.json({data: token})
        });
      });
    });
  }
});

router.post('/questions', (req, res, next) => {
  req.check('text', 'Please enter a valid question').len(1, 200);
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({errors})
  } else {
    const questionObj = new Question({
      quizId: req.body.quizId,
      text: req.body.text,
      answers: req.body.answers,
    });
    questionObj.save((err, item) => {
      if (err) {
        //console.log(err);
        return res.status(400).json({error: err.message})
      }
      res.status(200).send();
    })
  }

});

router.get('/questions', (req, res, next) => {
  var questionsList = {};

  Question.find({}, function (err, questions) {
    if (err) {
      return res.status(400).send(err.message);
    }
    questions.forEach(function(question) {
      questionsList[question._id] = question;
    });
    res.status(200).send(questionsList);
  });
});

router.get('/questions/:id', (req, res, next) => {
  req.params.id = parseInt(req.params.id);
  if (isNaN(req.params.id)) {
    res.status(404).send();
    return;
  }
  Question.findOne({questionId: req.params.id}, (err, question) => {
    if (!question) {
      return res.status(400).json({ error: 'Question not found' })
    }
    res.status(200).json(question);
  });
});

module.exports = router;
