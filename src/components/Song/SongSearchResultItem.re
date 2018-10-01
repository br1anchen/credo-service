open! Vrroom;

let ste = ReasonReact.string;

type t = {
  .
  "objectID": string,
  "name": string,
  "lang": string,
  "lyrics": array(string)
};

let decode = json =>
  Json.Decode.(
    {
      "objectID": json |> field("objectID", string),
      "name": json |> field("name", string),
      "lang": json |> field("lang", string),
      "lyrics": json |> field("lyrics", array(string))
    }
  );

let component = ReasonReact.statelessComponent("SongSearchResultItem");

let make = (~song, ~isFocused, ~onClick, _: childless) => {
  ...component,
  render: _self =>
    <MaterialUi.ListItem button=true onClick=(_e => onClick(song))>
      <MaterialUi.ListItemText
        inset=true
        primary=(song##name |> ste)
        secondary=(song##lang |> ste)
      />
    </MaterialUi.ListItem>
};
