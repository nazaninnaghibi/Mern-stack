const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
let User = require('../../models/User');


router.get('/', async (req, res) => {
  try {
    let user1 = await User.find();
    res.send(user1);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user1 = await User.findById(req.params.id);
    if (!user1) {
      return res.status(404).send('task not found');
    }
    res.send(user1);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.delete('/',auth,
 async (req, res)=> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const todo = await User.findById(req.body.id);
    if (!todo) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const result = await User.findByIdAndDelete(req.body.id);
    result.user = req.user.id;
    res.send(result);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.put('/',auth,
[
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Please enter valid email').isEmail(),
  check('password', 'please enter password with 3 or more').isLength({
    min: 3
  })
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const todo = await User.findById(req.body.id);
    if (!todo) {
      return res.status(404).json({ msg: 'User not found' });
    }
    hashedPassword = await bcrypt.hash(req.body.password, 12);
    todo.user = req.user.id;
    todo.name = req.body.name;
    todo.email = req.body.email;
    todo.password = hashedPassword;
    await todo.save();
    res.send(todo);
  } catch (err) {
    res.status(500).send('Server error');
  }
});


router.post(
  '/',
  [
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'please enter password with 3 or more').isLength({
      min: 3
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      //check if user email is already in the database
      let user1 = await User.findOne({ email: req.body.email });
      if (user1) {
        return res.status(400).json({ error: [{ msg: 'user already exits' }] });
      }
      
       //hash the password
       hashedPassword = await bcrypt.hash(req.body.password, 12);
      //create a user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });

     
      //save the user
      await newUser.save();

      //generate token
      const payload = {
        user: {
          id: newUser.id,
          name: newUser.name
        }
      };

      jwt.sign(
        payload,
        config.get('jwtsecret'),
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;