const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// MongoDB URL 
const mongoDB = 'mongodb+srv://wye57:ywy135790@bookstore.5uj55aq.mongodb.net/';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Simple test model
const Schema = mongoose.Schema;
const TestSchema = new Schema({
  name: String
});
const TestModel = mongoose.model('TestModel', TestSchema);

app.get('/', async (req, res) => {
  const result = await TestModel.find({});
  res.send(result);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});