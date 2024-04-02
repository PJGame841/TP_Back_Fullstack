module.exports = (req, res, next) => {
  if (!req.user.isEditeur()) {
    return res.status(403).send({ valid: false, message: 'Access denied.' });
  }

  next();
};
