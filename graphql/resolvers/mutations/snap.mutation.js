module.exports = {
  addSnap: async (parent, args, context) => {
    try {
      const { input } = args;

      const newSnap = await new context.db.Snap({
        message: input.message,
        userId: input.userId,
      });

      context.pubsub.publish("SNAP_ADDED", { snap: newSnap });

      return await newSnap.save();

    } catch (error) {
      throw new Error("Error adding snap");
    }
  },
};
