const { gql } = require('apollo-server');

const typeDef = gql`
  type Song {
    id: ID!
    name: String!
    lang: String!
    lyrics: [String!]!
  }
`;

module.exports = typeDef;
