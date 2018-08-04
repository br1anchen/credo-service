const SongType = require('./SongType');
const ScriptType = require('./ScriptType');
const { QueryType, QueryResolver } = require('./QueryType');
const { MutationType, MutationResolver } = require('./MutationType');

module.exports = {
  typeDefs: [QueryType, MutationType, SongType, ScriptType],
  resolvers: [QueryResolver, MutationResolver]
};
