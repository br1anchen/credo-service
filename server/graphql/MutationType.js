const { gql } = require('apollo-server');
const Song = require('../models/Song');

const MutationType = gql`
  type Mutation {
    addSong(name: String!, lang: String!, lyrics: [String!]!): Song
    updateLyrics(name: String!, lang: String!, lyrics: [String!]!): Song
  }
`;

const MutationResolver = {
  Mutation: {
    addSong: (_, { name, lang, lyrics }) => {
      const song = new Song({ name, lang, lyrics });
      return song.save();
    },
    updateLyrics: (_, { name, lang, lyrics }) => {
      return Song.where({ name, lang }).findOneAndUpdate({ lyrics });
    }
  }
};

module.exports = {
  MutationType,
  MutationResolver
};
