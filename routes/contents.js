const { Router } = require('express');
const { Content, validateBody } = require('../models/content');
const authMiddleware = require('../middlewares/auth');
const isEditeurMiddleware = require('../middlewares/isEditeur');

const router = new Router();

router.get('/', authMiddleware, async (req, res) => {
  const contents = await Content.find();
  res.send(contents);
});

router.get('/:id', authMiddleware, async (req, res) => {
  const content = await Content.findById(req.params.id);
  if (!content) {
    return res
      .status(404)
      .send({ valid: false, message: 'Content not found.' });
  }
  res.send({ valid: true, content });
});

router.post(
  '/',
  [authMiddleware, isEditeurMiddleware, validateBody],
  async (req, res) => {
    const content = new Content(req.body);
    await content.save();

    res.send({ valid: true, content });
  }
);

router.put(
  '/:id',
  [authMiddleware, isEditeurMiddleware, validateBody],
  async (req, res) => {
    const content = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!content) {
      return res
        .status(404)
        .send({ valid: false, message: 'Content not found.' });
    }

    res.send({ valid: true, content });
  }
);

router.delete(
  '/:id',
  [authMiddleware, isEditeurMiddleware],
  async (req, res) => {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res
        .status(404)
        .send({ valid: false, message: 'Content not found.' });
    }

    res.send({ valid: true, content });
  }
);

module.exports = router;
