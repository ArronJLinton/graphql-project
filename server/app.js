const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const testSchema = require('./schema/types_schemas');

/*

  mongodb://gq-admin:Rut2-17@ds031947.mlab.com:31947/gq-project

  
*/
app.use('/graphql', graphqlHTTP({
  schema: testSchema,
  // enables the graphiql interface for running queries (similar to postman)
  graphiql: true,
}));


app.listen(8080, () => {
    console.log('Listening for requests on port 8080');
});