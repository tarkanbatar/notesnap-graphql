const {withFilter} = require('graphql-subscriptions');

module.exports = {
  snap: {
    subscribe: withFilter(
      (parent, args, context) => context.pubsub.asyncIterator(['SNAP_ADDED']),
      (payload, variables) => {
        return variables.userId ? String(payload.snap.userId) === variables.userId : false;
      }
    )
  }
};
