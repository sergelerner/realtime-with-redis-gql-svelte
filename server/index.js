const { ApolloServer } = require("apollo-server");
const uuidv1 = require('uuid/v1');

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        sessionId: connection.context.sessionId, // https://github.com/apollographql/apollo-server/issues/1597#issuecomment-423641175
      };
    }
  },
  subscriptions: {
    onConnect: (connectionParams, webSocket) => ({ sessionId: uuidv1() })
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
