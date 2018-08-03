const SongType = require('./SongType');
const ScriptType = require('./ScriptType');
const { QueryType, QueryResolver } = require('./QueryType');

module.exports = {
  typeDefs: [QueryType, SongType, ScriptType],
  resolvers: [QueryResolver]
};
