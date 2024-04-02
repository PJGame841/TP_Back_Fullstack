require('dotenv').config();

const express = require('express');
const startDB = require('./startup/db');

const app = express();

app.use(express.json());

(async () => {
  await startDB.connect();
})();

require('./routes')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
