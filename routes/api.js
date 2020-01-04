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
      if (req.body.status===1) {
        const userObj = new User({
          name: req.body.name,
          status: 1,
          group: req.body.group,
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
      } else{
        const adminObj = new Admin({
          name: req.body.name,
          status: 0,
          email: req.body.email,
          password: req.body.password,
        });
        adminObj.passwordHash = passwordHash;
        Admin.findOne({name: req.body.name}, (err, admin) => {
          if (admin) {
            return res.status(400).json({error: 'This name already exist. Please, change it'})
          }
          Admin.findOne({email: req.body.email}, (err, admin) => {
            if (admin) {
              return res.status(400).json({error: 'This email already exist. Please, change it'})
            }
            adminObj.save((err, item) => {
              if (err) {
                return res.status(400).json({error: err.message})
              }
              res.status(200).send();
            })
          });
        });
      }
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
          return res.status(200).json({data: token})
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
    var arrayAnswer = req.body.answers;
    var trueExists = false;
    arrayAnswer.forEach(answer => {
        if (answer.IsRight === true) {
          trueExists = true;
        }
    });
    if (!trueExists){
      return res.status(400).json({error: 'You need at least one right answer'});
    }
    const questionObj = new Question({
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

router.get('/quizzes', (req, res, next) => {
  var quizzesList = {};

  Quizzes.find({}, function (err, quizzes) {
    if (err) {
      return res.status(400).send(err.message);
    }
    quizzes.forEach(function(quizze) {
      quizzesList[question._id] = quizze;
    });
    res.status(200).send(quizzesList);
  });
});

router.get('/quiz/:id', (req, res, next) => {
  req.params.id = parseInt(req.params.id);
  if (isNaN(req.params.id)) {
    res.status(404).send();
    return;
  }
  Quiz.findOne({quizId: req.params.id}, (err, quiz) => {
    if (!quiz) {
      return res.status(400).json({ error: 'Quiz not found' })
    }
    res.status(200).json(quiz);
  });
});

router.get('/languages', (req, res, next) => {
  var languagesList = {};

  Languages.find({}, function (err, languages) {
    if (err) {
      return res.status(400).send(err.message);
    }
    languages.forEach(function(language) {
      languagesList[question._id] = language;
    });
    res.status(200).send(languagesList);
  });
});

router.post('/tests', (req, res, next) => {
  Test.findOne({name: req.body.name}, (err, test) => {
    if (test) {
      return res.status(400).json({error: 'This name already exist. Please, change it'})
    }
    const testObj = new Test({
      name: req.body.name,
    });
    testObj.save((err, item) => {
      if (err) {
        return res.status(400).json({error: err.message})
      }
      res.status(200).send();
    })
  });
});

router.get('/user_static/:id', (req, res, next) => {
  req.params.id = parseInt(req.params.id);
  if (isNaN(req.params.id)) {
    res.status(404).send();
    return;
  }
  User_static.findOne({user_staticId: req.params.id}, (err, user_static) => {
    res.status(200).json(user_static);
  });
});

module.exports = router;
