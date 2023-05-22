import { createRequire } from "module";
const require = createRequire(import.meta.url);


const mongoose = require('mongoose');
import { connectToMongo } from './src/db/mongoose.js';
const Joi = require('joi');

connectToMongo();

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 0,
    max: 150
  }
});

function validateDocument(document) {
  console.log(document)
  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required()
  });

  return schema.validate(document);
}


const Model = mongoose.model('Model', schema);

const document = new Model({
  name: 123,
  age: "123"
});

const { error } = validateDocument(document);

if (error) {
  console.log(error.message);
} else {
  const modelDocument = new Model(document);
  modelDocument.save()
    .then(savedDocument => {
      console.log(savedDocument);
    })
    .catch(error => {
      console.log(error);
    });
}