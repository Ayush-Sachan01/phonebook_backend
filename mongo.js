const mongoose = require('mongoose')

//console.log(process.argv)

if (process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]
const name = process.argv.slice(3, process.argv.length - 1).join(' '); //because for some reason process.argv is taking ""Arto Vihavainen"" as two different strings.
const number = process.argv[process.argv.length - 1];

const url =
  `mongodb+srv://ayushsachan49:${password}@cluster0.kia3rv8.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person= mongoose.model('Person', phoneBookSchema)

if(process.argv.length==3){
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}
else{
    const person = new Person({
        name: name,
        number: number,
      })
      
      
      person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
      })
}

