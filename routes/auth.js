const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).send({ valid: false, message: 'User not found' });
  }

  const isValid = await user.checkPassword(password);

  if (!isValid) {
    return res.status(401).send({ valid: false, message: 'Invalid password' });
  }

  res.send({
    valid: true,
    token: user.getJwt(),
  });
});

module.exports = router;
