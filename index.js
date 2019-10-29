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
      response.send(JSON.stringify(users, null, 2));
    })
    .catch(error => {
      response.status(500).send('Users could not be found');
    });
});

const port = 5000;
server.listen(port, () => console.log(`Listening on port ${port}`));
