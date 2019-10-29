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

// delete user by :id
server.delete('/api/users/:id', (request, response) => {
  const { id } = request.params;
  db.remove(id)
    .then(user => {
      user === 0 && response.sendStatus(404);
      user !== 0 && response.sendStatus(200);
    })
    .catch(error => {
      console.log('delete error', error);
      //   response
      //     .status(500)
      //     .send({ error: `The user with ID: ${id} could not be removed` });
      // });
      response.sendStatus(500);
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

// update user
server.put('/api/users/:id', (request, response) => {
  const { name, bio } = request.body;
  const { id } = request.params;
  if (!name || !bio) {
    response.status(400).send({
      errorMessage: 'Please provide name and bio for the user.',
    });
  }
  db.update(id, { name, bio })
    .then(updateResponse => {
      updateResponse === 0 && response.send(404);
      response.sendStatus(200);
    })
    .catch(error => {
      response.sendStatus(500, error);
    });
});

const port = 5000;
server.listen(port, () => console.log(`Listening on port ${port}`));
