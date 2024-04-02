const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const roleEnum = ['admin', 'editeur', 'lecteur'];

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: roleEnum,
    default: 'lecteur',
  },
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};
userSchema.methods.isAdmin = function () {
  return this.role === 'admin';
};
userSchema.methods.isEditeur = function () {
  return this.role === 'admin' || this.role === 'editeur';
};
userSchema.methods.getJwt = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};
userSchema.methods.validate = function () {
  return this.constructor.validateRole(this.role);
};

userSchema.statics.validateRole = function (role) {
  return roleEnum.includes(role);
};

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model('User', userSchema);
module.exports.User = User;
module.exports.roleEnum = roleEnum;
module.exports.validateBody = function (req, res, next) {
  let errMessage = '';
  Object.keys(userSchema.obj).forEach((key) => {
    if (!Object.keys(req.body).includes(key)) {
      errMessage += `${key} manquant\n`;
    }
  });

  Object.keys(req.body).forEach((key) => {
    if (!Object.keys(userSchema.obj).includes(key)) {
      errMessage += `${key} invalide\n`;
    }
  });
  if (errMessage) {
    return res.status(400).send({ valid: false, message: errMessage });
  }

  const { role } = req.body;
  if (!User.validateRole(role)) {
    return res.status(400).send({ valid: false, message: 'Role invalide' });
  }

  next();
};
