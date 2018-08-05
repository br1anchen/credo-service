const { gql } = require('apollo-server');
const Song = require('../models/Song');

const MutationType = gql`
  type Mutation {
    addSong(name: String!, lang: String!, lyrics: [String!]!): Song
    updateLyrics(name: String!, lang: String!, lyrics: [String!]!): Song
    updateSongInfo(id: String!, name: String!, lang: String!): Song
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
    },
    updateSongInfo: (_, { id, name, lang }) => {
      return Song.findByIdAndUpdate(id, { name, lang });
    }
  }
};

module.exports = {
  MutationType,
  MutationResolver
};
