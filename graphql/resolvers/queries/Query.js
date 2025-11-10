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
  },
  activeUser : async (parent, args, context, info) => {
    if(!context.activeUser) {
      return null;
    }
    return await context.db.User.findById(context.activeUser.id);
  }
};

module.exports = Query;
