const { gql } = require("apollo-server");

const schema = gql`

  type WHITE_LIST {
    name: String!
    all: Boolean!
    list: [String]
  }

  type Query {
    wl: [WHITE_LIST]
  }

  type Mutation {
    wl(input: String!): [WHITE_LIST]
  }

  type Subscription {
    wl: [WHITE_LIST]
  }
`;

module.exports = schema;
