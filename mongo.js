const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password, the name and the number as arguments: node mongo.js <password> <name> <number>'
  )
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]

let number = 0
if (process.argv.length >= 4 && typeof process.argv[4] === Number) {
  number = process.argv[4]
} else if (process.argv.length >= 4) {
  number = parseInt(process.argv[4].replace(/[^0-9]/g, ''), 10)
}

//process.argv.length >= 4 && typeof process.argv[4] == Number ? number = process.argv[4] : process.argv.length >= 4 ? number = parseInt(process.argv[4].replace(/[^0-9]/g, ''), 10)

const url = `mongodb+srv://jorge:${password}@cluster0.pahgm.mongodb.net/contact?retryWrites=true&w=majority`
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)
const contact = new Contact({
  name: name,
  number: number,
})

if (process.argv.length > 3) {
  contact.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(contact)
    })
    mongoose.connection.close()
  })
}
