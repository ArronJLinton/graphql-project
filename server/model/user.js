const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    age: Number,
    city: String,
    // posts: {
    // },
    // hobbies: {
    // }
});

module.exports = mongoose.model('User', userSchema);