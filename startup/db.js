const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { User } = require('../models/user');

module.exports.connect = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = await mongoServer.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(uri, mongooseOpts);

  console.log('MongoDB is connected, inserting default users');

  const users = [
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'editeur', password: 'editeur', role: 'editeur' },
    { username: 'lecteur', password: 'lecteur', role: 'lecteur' },
  ];

  for (const user of users) {
    const newUser = new User(user);
    await newUser.save();
  }

  console.log('Default users inserted');
};
