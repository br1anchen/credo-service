module GetAllSongs = [%graphql
  {|
    query getAllSongs {
      allSongs {
        id
        name
      }
    }
  |}
];

module GetAllSongsQuery = ReasonApollo.CreateQuery(GetAllSongs);
