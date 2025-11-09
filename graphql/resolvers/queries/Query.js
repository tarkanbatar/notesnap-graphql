const Query = {
  user: async (parent, args, context, info) => {
    return await context.db.User.findById(args.id);
  },
  users: async (parent, args, context, info) => {
    return await context.db.User.find().sort({'createdAt': 'desc'});
  },
  snap: async (parent, args, context, info) => {
    return await context.db.Snap.findById(args.id);
  },
  snaps: async (parent, args, context, info) => {
    return await context.db.Snap.find().sort({'createdAt': 'desc'});
  }
};

module.exports = Query;
