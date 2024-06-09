const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
app.use(cors())
app.use(express.json());
let persons=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


morgan.token('data', function (req) { return JSON.stringify(req.body) })

const logger= (tokens,req,res)=>{
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.data(req)
  ].join(' ')
}

app.use(morgan(logger));

app.get('/api/persons',(request,response)=>{
      console.log(persons)
    response.json(persons)
})

app.get('/info',(request,response)=>{
    const date=new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)  
})

app.get('/api/persons/:id',(request,response)=>{
  const id= Number(request.params.id)
  const person=persons.find(n=>n.id===id)
  if(person)
{
   response.json(person)
}
else{
  response.status(404).end()
}
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(n => n.id !== id)
  response.status(204).end()
})

const generateID=()=>
  {
    const min = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0

    return Math.floor(Math.random() * 1000000000) + (min +1)
  }

app.post('/api/persons',(requests,response)=>{
  const person= requests.body
  person.id= generateID()
  const ifAlreadyExists =persons.find(n=>n.name === person.name)
  if(!person.name ){
    return response.status(400).json({
      error: "Name is missing"
    })
  } 
  else if(!person.number){
    return response.status(400).json({
      error: "Number is missing"
    }) 
  }
  else if(ifAlreadyExists){
    return response.status(400).json({
      error: "Name must be unique"
    }) 
  } 
  persons=persons.concat(person)
  response.json(person)
})



const PORT= process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})