const algoliasearch = require('algoliasearch');

require('dotenv').config();

const searchConfig = {
  appId: process.env.ALGOLIA_APPID,
  apiKey: process.env.ALGOLIA_API_KEY,
  indexName: process.env.ALGOLIA_INDEX,
};

const client = algoliasearch(searchConfig.appId, searchConfig.apiKey);
const index = client.initIndex(searchConfig.indexName);

const getObjectID = name => name.toLowerCase().replace(' ', '_');

exports.initSongsSearch = songs => {
  index.addObjects(
    songs.map(({ name, lang, lyrics }) => {
      return {
        name,
        lang,
        lyrics,
        objectID: getObjectID(name),
      };
    }),
    (err, content) => {
      if (err) throw err;

      console.log(content);
    }
  );
};

exports.addSongObject = song => {
  index.addObject(
    {
      ...song,
      objectID: getObjectID(name),
    },
    (err, content) => {
      if (err) throw err;

      console.log(content);
    }
  );
};
