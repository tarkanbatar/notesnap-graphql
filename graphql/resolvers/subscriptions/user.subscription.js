module.exports = {
  user: {
    subscribe: 
      (parent, args, context) => context.pubsub.asyncIterator(['USER_ADDED']),
  }
};
