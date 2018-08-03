const { ApolloServer } = require('apollo-server');

require('./mongoDB');

const server = new ApolloServer(require('./graphql'));

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
