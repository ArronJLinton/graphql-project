const _ = require('lodash');
const {User, Hobby, Post} = require('../model');
const { 
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
    GraphQLInt, 
    GraphQLSchema, 
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// const userData = [
//     // TODO: Is the default data type for GraphQLID a string?
//     {id: '1', name: 'Scarlet', age: 38, city: 'Seattle'},
//     {id: '2', name: 'Pearl', age: 23, city: 'Sicily'},
//     {id: '3', name: 'Jasmine', age: 28, city: 'Egypt'},
// ];

// const hobbyData =  [
//     {id: '1', title: 'Programming', description: 'Using computers to make the world a better place.', userId: '1'},
//     {id: '2', title: 'Soccer', description: 'It\'s a beautiful game', userId: '1'},
//     {id: '3', title: 'Reading', description: 'Knowledge is power.', userId: '2'},
//     {id: '4', title: 'Life', description: 'Nothing better than enjoying yourself.', userId: '3'},
//     {id: '5', title: 'Music', description: 'The healing force of the world.', userId: '3'}
// ];

// const postData = [
//     {id: '1', comment: 'Building a Mind', userId: '1'},
//     {id: '2', comment: 'GraphQL is Amazing', userId: '1'},
//     {id: '3', comment: 'How to Change the World', userId: '2'},
//     {id: '4', comment: 'How to Change the World', userId: '2'},
//     {id: '5', comment: 'How to Change the World', userId: '3'}
// ];

// Create types
const UserType = new GraphQLObjectType({
    // pass in a value for name and description for documentation purposes
    name: 'User',
    description: 'Documentation for user...',
    // fields for the user
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        city: {type: GraphQLString},
        posts: {
            // GraphQLList -> creates an array of posts
            type: GraphQLList(PostType),
            resolve(parent, args) {
                // use lodash .filter() method to return all post objects that contain userId equal to parent.id
                // will be return as an array
                // return _.filter(postData, {userId: parent.id})
                // return db.User.find()
                return Post.find({userId: parent.id})
            }
        },
        hobbies: {
            type: GraphQLList(HobbyType),
            resolve(parent, args) {
                // return _.filter(hobbyData, {userId: parent.id})
                return Hobby.find({userId: parent.id})
                
            }
        }
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobbies description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                // return _.find(userData, {id: parent.userId})
                return User.findById(parent.userId)
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                // return _.find(userData, {id: parent.userId})
                return User.findById(parent.userId)
            }
        }
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
            args: {id: {type: GraphQLID}},
            // parent refers to the user type
            // args refers to the args
            resolve(parent, args) {
                // use lodash to iterate around userData and return the user object associated with the incoming id
                // return _.find(userData, {id: args.id})
                // we resolve with data
                // get and return data from a datasource
                return User.findById(args.id)
            }
        },
        users: {
            type: GraphQLList(UserType),
            resolve(parent, args) {
                return User.find();
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                // return data for our hobby
                // return _.find(hobbyData, {id:args.id})
                return Hobby.findById(args.id)
            }
        },
        hobbies: {
            type: GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find();
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                // return data for our hobby
                // return _.find(postData, {id:args.id})
                return Post.findById(args.id)
            }
        },
        posts: {
            type: GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find();
            }
        },
       
        
    }
});


// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // declare a createUser method for UserType
        createUser: {
            type: UserType,
            // arguments to be passed into the method
            args: {
                // id: {type: GraphQLID}
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLID)},
                city: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                const { name, age, city } = args;
                const user = new User({ name, age, city });
                user.save();
                return user;
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString},
                age: {type: GraphQLID},
                city: {type: GraphQLString}
            },
            resolve(parent, args) {
                const {name, age, city} = args;
                return User.findByIdAndUpdate(args.id, {
                    $set: {name, city, age}
                }, {new:true})
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                const user = User.findByIdAndDelete(args.id).exec();
                if(!user) throw new("Error")
                return user
            }
        },
        createPost: {
            type: PostType,
            args: {
                // id: {type: GraphQLID}
                comment: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                const { comment, userId } = args;
                const post = new Post({ comment, userId });
                post.save();
                return post;
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                comment: {type: new GraphQLNonNull(GraphQLString)},
                // comment out userId because there should never be a reason why we would update the user associated with this post
                // userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                const {comment, userId} = args;
                return Post.findByIdAndUpdate(args.id, {
                    $set: {comment}
                }, {new:true})
            }
        },
        deletePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                return Post.findByIdAndDelete(args.id)
            }
        },
        createHobby: {
            type: HobbyType,
            args: {
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                const {title, description, userId} = args;
                const hobby = new Hobby({title, description, userId});
                hobby.save();
                return hobby;
            }
        },
        updateHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
                // userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                const {title, description} = args;
                return Hobby.findByIdAndUpdate(args.id, {
                    $set: {title, description}
                }, {new:true})
            }
        },
        deleteHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                return Hobby.findByIdAndDelete(args.id)
            }
        },
    }   
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})