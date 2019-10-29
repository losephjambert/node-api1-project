// implement your API here
const express = require('express');
const db = require('./data/db.js');

// create a server
const server = express();

// apply json middleware to parse the body of requests
server.use(express.json());

// base route
server.get('/', (request, response) => {
  const text = `It's working!`;
  response.send(`
  <h1 style="font-size: 5vmax; color: blue;">${text}</h1>
  `);
});

// get users
server.get('/api/users', (request, response) => {
  db.find()
    .then(users => {
      response.send(users);
    })
    .catch(error => {
      response
        .status(500)
        .send({ error: 'The users information could not be retrieved.' });
    });
});

// get user by :id
server.get('/api/users/:id', (request, response) => {
  const { id } = request.params;
  db.findById(id)
    .then(user => {
      user && response.send(user);
      !user &&
        response.status(404).send({
          message: `The user with the specified ID: ${id} does not exist.`,
        });
      console.log(user);
    })
    .catch(error => {
      response
        .status(500)
        .send({ error: 'The user information could not be retrieved.' });
    });
});

// create user
server.post('/api/users', (request, response) => {
  const { name, bio } = request.body;
  if (!name || !bio) {
    response.status(400).send({
      errorMessage: 'Please provide name and bio for the user.',
    });
  }
  db.insert({ name, bio })
    .then(user => {
      response.send(user);
    })
    .catch(error => {
      response.status(500).send('User could not be created');
    });
});

const port = 5000;
server.listen(port, () => console.log(`Listening on port ${port}`));
