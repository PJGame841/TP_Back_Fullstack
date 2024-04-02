const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Content = mongoose.model('Content', contentSchema);
module.exports.Content = Content;
module.exports.validateBody = function (req, res, next) {
  let errMessage = '';
  Object.keys(contentSchema.obj).forEach((key) => {
    if (!Object.keys(req.body).includes(key)) {
      errMessage += `${key} manquant\n`;
    }
  });

  Object.keys(req.body).forEach((key) => {
    if (!Object.keys(contentSchema.obj).includes(key)) {
      errMessage += `${key} inconnu\n`;
    }
  });

  if (errMessage) {
    return res.status(400).send({ valid: false, message: errMessage });
  }

  next();
};
