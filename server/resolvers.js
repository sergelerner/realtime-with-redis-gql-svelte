const pubsub = require("./pubsub");
const { get, set } = require("./redis");

const COMPONENTS = {
  WHITE_LIST: "wl",
};

module.exports = {
  Query: {
    wl: async () => await get(COMPONENTS.WHITE_LIST),
  },
  
  Mutation: {
    wl: async (parent, args) => {
      const { input } = args
      const component = COMPONENTS.WHITE_LIST
      const data = JSON.parse(input)

      pubsub.publish(component, { [component]: data })
      await set(component, data)

      return data
    },
  },
  Subscription: {
    wl: {
      subscribe: async () => {
        const data = await get(COMPONENTS.WHITE_LIST)
        pubsub.publish(COMPONENTS.WHITE_LIST, { [COMPONENTS.WHITE_LIST]: data })
        return pubsub.asyncIterator(COMPONENTS.WHITE_LIST)
      },
    },
  }
};
