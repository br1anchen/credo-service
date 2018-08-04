const { gql } = require('apollo-server');
const Song = require('../models/Song');

const QueryType = gql`
  type Query {
    songs: [Song!]!
    song(id: String!): Song
    songByName(name: String!): Song
  }
`;

const QueryResolver = {
  Query: {
    songs: () => Song.find(),
    song: (_, { id }) => Song.findById(id),
    songByName: (_, { name }) => Song.where({ name }).findOne()
  }
};

module.exports = {
  QueryType,
  QueryResolver
};
