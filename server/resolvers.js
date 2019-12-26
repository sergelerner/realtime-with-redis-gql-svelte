const pubsub = require("./pubsub");
const { get, set } = require("./redis");

const COMPONENTS = {
  WHITE_LIST: "wl",
};

module.exports = {
  Query: {
    wl: async () => {
      const input = await get(COMPONENTS.WHITE_LIST)
      const data = JSON.parse(input)
      return data
    },
  },
  
  Mutation: {
    wl: async (parent, args) => {
      const { input } = args
      const component = COMPONENTS.WHITE_LIST
      const data = JSON.parse(input)

      pubsub.publish(component, { [component]: input })
      await set(component, input)

      return data
    },
  },
  Subscription: {
    wl: {
      subscribe: () => pubsub.asyncIterator(COMPONENTS.WHITE_LIST)
    },
  }
};
