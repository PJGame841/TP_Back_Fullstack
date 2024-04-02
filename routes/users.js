const { Router } = require('express');
const { User, validateBody } = require('../models/user');
const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

const router = Router();

router.get('/me', authMiddleware, (req, res) => {
  res.send(req.user);
});

router.get('/', authMiddleware, async (req, res) => {
  const users = await User.find().select('-password');
  res.send(users);
});

router.post('/', [authMiddleware, isAdmin, validateBody], async (req, res) => {
  if (await User.findOne({ username: req.body.username })) {
    return res
      .status(400)
      .send({ valid: false, message: 'User already exists' });
  }

  const user = new User(req.body);
  await user.save();

  res.send({ valid: true, user });
});

router.put(
  '/:id',
  [authMiddleware, isAdmin, validateBody],
  async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).send({ valid: false, message: 'User not found' });
    }

    res.send({ valid: true, user });
  }
);

router.delete('/:id', [authMiddleware, isAdmin], async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).send({ valid: false, message: 'User not found' });
  }

  res.send({ valid: true, user });
});

module.exports = router;
