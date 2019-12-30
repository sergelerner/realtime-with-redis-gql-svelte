const { withFilter } = require("graphql-subscriptions");
const pubsub = require("./pubsub");
const { get, set } = require("./redis");

const COMPONENTS = {
  WHITE_LIST: "wl",
};

const sessions = []

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
      subscribe: async (payload, variables, context) => {
        const data = await get(COMPONENTS.WHITE_LIST)

        setImmediate(() => {
          pubsub.publish(COMPONENTS.WHITE_LIST, { [COMPONENTS.WHITE_LIST]: data, isFirstMessage: true })
        })

        return withFilter(
          () => pubsub.asyncIterator(COMPONENTS.WHITE_LIST),
          (payload, variables, context) => {
            const { sessionId } = context
            const { isFirstMessage } = payload
            const isFirstConnection = !sessions.includes(sessionId)
            if (isFirstConnection) {
              sessions.push(sessionId)
            }
            return isFirstConnection || !isFirstMessage
          }
        )(payload, variables, context)
      },
    },
  }
};
