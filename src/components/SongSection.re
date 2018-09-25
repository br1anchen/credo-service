open GetAllSongsQuery;

[%mui.withStyles
  "Panel"({
    root:
      ReactDOMRe.Style.make(
        ~width="100%",
        ~padding="20px",
        ~display="flex",
        ~flexDirection="column",
        (),
      ),
    searchField: ReactDOMRe.Style.make(~marginBottom="10px", ()),
  })
];

type action =
  | Search(string);

type state = {keyword: string};

let component = ReasonReact.reducerComponent("SongSection");

let make = _children => {
  ...component,
  initialState: () => {keyword: ""},
  reducer: action =>
    switch (action) {
    | Search(value) => (
        state =>
          ReasonReact.UpdateWithSideEffects(
            {...state, keyword: value},
            _self => Js.log("Search: " ++ value),
          )
      )
    },
  render: self =>
    <GetAllSongsQuery>
      ...{
           ({result}) =>
             <QueryView
               result
               accessData={response => Some(response##allSongs)}
               render={
                 (data, _onLoadMore) =>
                   <Panel
                     render={
                       classes =>
                         <div className={classes.root}>
                           <MaterialUi.Input
                             className={classes.searchField}
                             placeholder="Type search text"
                             onChange={
                               event =>
                                 self.send(
                                   Search(
                                     ReactEvent.Form.target(event)##value,
                                   ),
                                 )
                             }
                           />
                           <Songs />
                         </div>
                     }
                   />
               }
             />
         }
    </GetAllSongsQuery>,
};
