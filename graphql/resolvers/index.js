// Query Resolvers
const Query = require("./queries/Query");
const Snap = require("./queries/Snap");
const User = require("./queries/User");

//Mutation Resolvers
const Mutation = require("./mutations");

//Subscription Resolvers
const Subscription = require("./subscriptions");

module.exports = {
    Query,
    Mutation,
    Snap,
    Subscription,
    User,
};