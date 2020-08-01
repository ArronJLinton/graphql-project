const { 
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
    GraphQLInt, 
    GraphQLSchema 
} = require('graphql');

const data = [
    {
        id: '1',
        name: 'Scarlet',
        age: 38
    },
    {
        id: '2',
        name: 'Pearl',
        age: 23
    },
    {
        id: '3',
        name: 'Jasmine',
        age: 28
    },
];

// Create types
const UserType = new GraphQLObjectType({
    // pass in a value for name and description for documentation purposes
    name: 'User',
    description: ' Documentation for user...',
    // fields for the user
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
});

//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        // establish a connection between root and UserType
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            // parent refers to the user type
            // args refers to the args
            resolve(parent, args) {
                // we resolve with data
                // get and return data from a datasource
                let user = {
                    id: '123',
                    age: 30,
                    name: 'Justin'
                };

                return user
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})