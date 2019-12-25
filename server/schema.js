const { gql } = require("apollo-server");

const schema = gql`

  type WHITE_LIST {
    all: Boolean!
    list: [String]
  }

  type Query {
    wl: [WHITE_LIST]
  }

  type Mutation {
    wl: [WHITE_LIST]
  }

  type Subscription {
    wl: [WHITE_LIST]
  }
`;

module.exports = schema;
