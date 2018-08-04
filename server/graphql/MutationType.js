const { gql } = require('apollo-server');
const Song = require('../models/Song');

const MutationType = gql`
  type Mutation {
    addSong(name: String!, lang: String!, lyrics: [String!]!): Song
  }
`;

const MutationResolver = {
  Mutation: {
    addSong: (_, { name, lang, lyrics }) => {
      const song = new Song({ name, lang, lyrics });
      return song.save();
    }
  }
};

module.exports = {
  MutationType,
  MutationResolver
};
