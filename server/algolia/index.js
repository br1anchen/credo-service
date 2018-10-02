const algoliasearch = require('algoliasearch');

require('dotenv').config();

const searchConfig = {
  appId: process.env.ALGOLIA_APPID,
  apiKey: process.env.ALGOLIA_API_KEY,
  indexName: process.env.ALGOLIA_INDEX,
};

const client = algoliasearch(searchConfig.appId, searchConfig.apiKey);
const index = client.initIndex(searchConfig.indexName);

const songDB2SearchObject = ({ name, lang, lyrics, _id: dbID }) => ({
  name,
  lang,
  lyrics,
  dbID,
});

exports.initSongsSearch = songs => {
  index.addObjects(songs.map(songDB2SearchObject), (err, content) => {
    if (err) throw err;

    console.log(content);
  });
};

exports.addSongObject = song => {
  index.addObject(songDB2SearchObject(song), (err, content) => {
    if (err) throw err;

    console.log(content);
  });
};
