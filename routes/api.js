var express = require('express');
var router = express.Router();
const v4 = require('node-uuid').v4;
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.post('/login', function(req, res, next) {
  req.check('email', 'Please enter a valid email').len(1).isEmail();
  req.check('password', 'Please enter a password with a length between 6 and 20 digits').len(6, 20);
  const errors = req.validationErrors();
  const password = req.body.password;

  if (errors) {
    return res.status(400).json({ errors })
  } else {
    if (req.body.email !== "tenforever72@gmail.com" && password !== "12345678") {
      return res.status(400).json({ error: "Wrong email or password. Try again!!!" });
    }

    // User.findOne({ email: req.body.email }, (err, user) => {
    //   if (err) {
    //     return res.status(400).json({ error: err.message })
    //   }
    //   if (!user) {
    //     return res.status(400).json({ error: 'User not found' })
    //   }
    //   User.comparePasswordAndHash(password, user.passwordHash, (err, areEqual) => {
    //     if (err) {
    //       return res.status(400).json({ error: err.message })
    //     }
    //     if (!areEqual) {
    //       return res.status(400).json({ error: 'Wrong password' })
    //     }
    const payload = {
      // _id: user._id,
      iss: 'http://localhost:3000'
      // permissions: 'poll',
    };
    const options = {
      expiresIn: '7d',
      jwtid: v4(),
    };
    const secret = new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64');
    jwt.sign(payload, secret, options, (err, token) => {
      return res.json({ data: token })
    });
  }
});

  //res.send('login page');

module.exports = router;
