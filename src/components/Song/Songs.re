open GetAllSongsQuery;

let ste = ReasonReact.string;

let component = ReasonReact.statelessComponent("Songs");

let make = _children => {
  ...component,
  render: _self =>
    <GetAllSongsQuery>
      ...{
           ({result}) =>
             <QueryView
               result
               accessData={response => Some(response##allSongs)}
               render={
                 (data, _onLoadMore) =>
                   data
                   |> Array.mapi((index, song) =>
                        <MaterialUi.ListItem
                          key={index |> string_of_int} button=true>
                          <MaterialUi.ListItemText
                            inset=true
                            primary={song##name |> ste}
                          />
                        </MaterialUi.ListItem>
                      )
                   |> ReasonReact.array
               }
             />
         }
    </GetAllSongsQuery>,
};
