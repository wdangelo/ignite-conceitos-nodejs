const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const user = users.find((user) => user.username === username)

  if(!user){
    return response.status(400).json({error: 'User not found!'})
  }
  request.user = user
  next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []

  })

  return response.status(200).json(users)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const {user} = request

  return response.json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body
  const {user} = request

  const todoAdd = {
    id: uuidv4(),
    title,
    doen: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todoAdd)

  return response.status(201).json(user.todos)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const {title, deadline} = request.body
  const{ user } = request

  const todo = user.todos.find((todo) => todo.id === id)

  if(!todo){
    return response.status(400).json({erro: 'Todo not found!'})
  }

  todo.title = title
  todo.deadline = deadline

  return response.status(201).send()

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;