const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

app.use('/graphql', graphqlHTTP({
  schema,
  // enables the graphiql interface for running queries (similar to postman)
  graphiql: true,
}));

app.listen(8080, () => {
    console.log('Listening for requests on port 8080');
});