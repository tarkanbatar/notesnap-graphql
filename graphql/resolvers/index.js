// Query Resolvers
const Query = require("./queries/Query");
const Snap = require("./queries/Snap");
const User = require("./queries/User");

//Mutation Resolvers
const Mutation = require("./mutations");    

module.exports = {
    Query,
    Mutation,
    Snap,
    User,
};