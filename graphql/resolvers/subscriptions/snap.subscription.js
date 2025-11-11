const { subscribe } = require("graphql");

module.exports = {
  createSnap: {
    subscribe: (parent, args, context) => context.pubsub.asyncIterator(['SNAP_ADDED'])
  }
};
