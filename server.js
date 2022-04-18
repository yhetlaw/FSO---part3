require('dotenv').config()
const mongoose = require('mongoose')
const BSON = require('bson')
const Contact = require('./models/contact')

const express = require('express')
const { json } = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))

const morgan = require('morgan')

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
app.use(cors())

const { response } = require('express')

//CONNECTION
console.log(process.env.MONGODB_URI)
const url = process.env.MONGODB_URI
mongoose.connect(url)

//GET
app.get('/api/persons', (req, res) => {
  Contact.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  let a = new Date().toString()
  console.log(a)
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${a}</p>
  `)
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      contact ? response.json(contact) : response.status(404).end()
    })
    .catch((error) => next(error))
})

//DELETE
app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

//POST
app.post('/api/persons', (request, response, next) => {
  console.log(request)
  const body = request.body

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact
    .save()
    .then((result) => {
      response.json(result)
      console.log(`added ${body.name} number ${body.number} to phonebook`)
    })
    .catch((error) => next(error))
})

//PUT
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const contact = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true, runValidators: true, context: 'query' })
    .then((updatedContact) => {
      response.json(updatedContact)
    })
    .catch((error) => next(error))
})

//Errors
//The error handler checks if the error is a CastError exception, caused by an invalid object id for Mongo
//In this situation the error handler will send a response to the browser with the response object passed as a parameter.
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

//Handles requests with unknown end points
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

//PORT
console.log(process.env.PORT)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
