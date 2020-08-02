require('dotenv').config()
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const testSchema = require('./schema/types_schemas');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

/*

  mongodb://gq-admin:Rut2-17@ds031947.mlab.com:31947/gq-project

*/
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds031947.mlab.com:31947/gq-project`, { useUnifiedTopology: true , useNewUrlParser: true });
mongoose.connection.once('open', () => {
  console.log('Yes! Successful Mongoose Connection!')
});
mongoose.connection.once('error', (err) => {
  console.log('ERROR: ', err);
});

app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  // enables the graphiql interface for running queries (similar to postman)
  graphiql: true,
}));


app.listen(8080, () => {
    console.log('Listening for requests on port 8080');
});