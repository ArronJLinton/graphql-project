const graphql = require('graphql');

const { 
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLSchema
} = graphql;

// Scalar Type
/*
    String
    int
    Float
    Boolean
    ID
*/
const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'Represents a Person Type',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: GraphQLInt},
        isMarried: {type: GraphQLBoolean},
        gpa: {type: GraphQLFloat},
        justAType: {
            type: Person,
            resolve(parent, args) {
                return parent
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        person: {
            type: Person,
            resolve(parent, args) {
                let personObj = {
                    name: 'Antonio',
                    age: 35,
                    isMarried: true,
                    gpa: 3.5,
                }
                return personObj
            }
        }
    }
});

module.exports = {
    query: RootQuery
}