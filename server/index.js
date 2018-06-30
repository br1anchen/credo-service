const { ApolloServer, gql, UserInputError } = require("apollo-server");

const array2List = (arr, key) => {
  const result = {};
  arr.forEach(e => {
    if (e[key]) {
      result[e[key]] = e;
    }
  });
  return result;
};

const songs = require("./songs.json");
const songList = array2List(songs, "id");
const scripts = require("./scripts.json");
const scriptList = array2List(scripts, "id");
const schedules = require("./schedules.json");
const scheduleList = array2List(schedules, "date");

const typeDefs = gql`
  type Page {
    id: ID!
    lines: [String!]!
  }

  interface LibraryEntry {
    id: ID!
    pages: [Page!]!
  }

  type Song implements LibraryEntry {
    id: ID!
    name: String!
    lang: String!
    pages: [Page!]!
  }

  type Scripts implements LibraryEntry {
    id: ID!
    name: String!
    pages: [Page!]!
  }

  enum RefType {
    SONG
    SCRIPTS
  }

  type ReferredEntry {
    id: ID!
    ref: ID!
    refType: RefType!
  }

  union ScheduleEntry = ReferredEntry | Page

  type Schedule {
    id: ID!
    date: String!
    entries: [ScheduleEntry!]!
  }

  type PageResult {
    ref: ID
    refType: RefType
    lines: [String!]!
  }

  type ScheduleResult {
    id: ID!
    pages: [PageResult!]!
  }

  type Query {
    songs: [Song!]!
    scripts: [Scripts!]!
    schedules: [Schedule!]!
    getScheduleByDate(date: String!): ScheduleResult
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    songs: () => songs,
    scripts: () => scripts,
    schedules: () => schedules,
    getScheduleByDate: (_, { date }) => {
      const schedule = scheduleList[date];

      if (schedule) {
        const pages = [];
        schedule.entries.forEach(e => {
          if (e.ref !== undefined && e.refType !== undefined) {
            switch (e.refType) {
              case 0:
                const song = songList[e.ref];
                if (song) {
                  pages.push(
                    ...song.pages.map(sp => ({
                      ref: e.ref,
                      refType: e.refType,
                      lines: sp.lines
                    }))
                  );
                }
                break;
              case 1:
                const script = scriptList[e.ref];
                if (script) {
                  pages.push(
                    ...script.pages.map(sp => ({
                      ref: e.ref,
                      refType: e.refType,
                      lines: sp.lines
                    }))
                  );
                }
                break;
            }
          } else {
            pages.push(e);
          }
        });

        if (pages.length === 0) {
          return new UserInputError("Schedule is empty");
        }

        return {
          id: schedule.id,
          pages
        };
      }

      return new UserInputError("No schedule found for " + date);
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
