require('dotenv').config();
const mongoose = require('mongoose');
const BSON = require('bson');
const Contact = require('./models/contact');

const { json } = require('express');

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('build'));

const morgan = require('morgan');

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const cors = require('cors');
app.use(cors());

const { response } = require('express');

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

//CONNECTION
console.log(process.env.MONGODB_URI);
const url = process.env.MONGODB_URI;
mongoose.connect(url);

//GET
app.get('/api/persons', (req, res) => {
  Contact.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/info', (req, res) => {
  let a = new Date().toString();
  console.log(a);
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${a}</p>
  `);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

//DELETE
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  console.log(id);
  Contact.deleteOne({ _id: new BSON.ObjectId(id) }).then(() => {
    console.log(`${objectId} has been deleted`);
  });
  response.status(204).end();
});

//POST
app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: 'Name is missing',
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: 'Number is missing',
    });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });
  contact.save().then((result) => {
    console.log(`added ${body.name} number ${body.number} to phonebook`);
  });
  response.json(contact);
});

//PORT
console.log(process.env.PORT);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
