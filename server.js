const { json } = require('express');
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const cors = require('cors');
app.use(cors());

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

app.get('/api/persons', (req, res) => {
  res.json(persons);
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

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = (min, max) => {
  const randomId = persons.length > 0 ? Math.floor(Math.random() * (max - min)) + min : 0;
  return randomId;
};

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
  } else if (persons.map((person) => person.name).includes(body.name)) {
    return response.status(400).json({
      error: 'Name must be unique',
    });
  }

  /* !body.name
    ? response.status(400).json({
        error: 'Name is missing',
      })
    : !body.number
    ? response.status(400).json({
        error: 'Number is missing',
      })
    : persons.map((person) => person.name).includes(body.name)
    ? response.status(400).json({
        error: 'Name must be unique',
      })
    : response.sendStatus(200); */

  const person = {
    id: generateId(1, 5000000),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
