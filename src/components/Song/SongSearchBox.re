open! Rebase;

open! Vrroom;

module Config = Config.Search;

module Key = {
  let down = 40;
  let up = 38;
  let enter = 13;
};

type state = {
  searchClient: Algolia.Helper.t,
  query: string,
  results: array(SongSearchResultItem.t),
  focused: option(SongSearchResultItem.t)
};

type action =
  | QueryChanged(string)
  | ResultsChanged(array(Js.Json.t))
  | SelectItem(SongSearchResultItem.t)
  | KeyDown(int);

[%mui.withStyles
  "SearchBox"({
    root:
      ReactDOMRe.Style.make(
        ~width="100%",
        ~padding="20px",
        ~display="flex",
        ~flexDirection="column",
        ()
      ),
    searchField: ReactDOMRe.Style.make(~marginBottom="10px", ())
  })
];

let component = ReasonReact.reducerComponent("SongSearchBox");

let make = (~focusOnMount=false, _: childless) => {
  ...component,
  initialState: () => {
    searchClient:
      Algolia.Helper.make(
        Algolia.makeClient(Config.appId, Config.apiKey),
        Config.songsIndex
      ),
    query: "",
    results: [||],
    focused: None
  },
  reducer: (action, state) =>
    switch action {
    | QueryChanged(query) =>
      switch query {
      | "" =>
        ReasonReact.Update({...state, query, results: [||], focused: None})
      | _ =>
        ReasonReact.UpdateWithSideEffects(
          {...state, query},
          (
            ({state}) =>
              state.searchClient
              |> Algolia.Helper.setQuery(query)
              |> Algolia.Helper.search()
              |> ignore
          )
        )
      }
    | ResultsChanged(results) =>
      let results = results |> Array.map(SongSearchResultItem.decode);
      ReasonReact.Update({...state, results, focused: results[0]});
    | SelectItem(song) =>
      ReasonReact.UpdateWithSideEffects(
        {...state, query: "", results: [||], focused: None},
        (_self => Js.log(song##name))
      )
    | KeyDown(key) =>
      if (key === Key.down) {
        ReasonReact.Update({
          ...state,
          focused:
            state.focused
            |> Option.flatMap(p =>
                 Array.findIndex(this => this === p, state.results)
               )
            |> Option.map(((i, _)) => i + 1)
            |> Option.getOr(0)
            |> Array.get(state.results)
        });
      } else if (key === Key.up) {
        ReasonReact.Update({
          ...state,
          focused:
            state.focused
            |> Option.flatMap(p =>
                 Array.findIndex(this => this === p, state.results)
               )
            |> Option.map(((i, _)) => i - 1)
            |> Option.getOr(Array.length(state.results) - 1)
            |> Array.get(state.results)
        });
      } else if (key === Key.enter) {
        ReasonReact.SideEffects(
          (
            self =>
              self.state.focused
              |> Option.forEach(this => self.send(SelectItem(this)))
          )
        );
      } else {
        ReasonReact.NoUpdate;
      }
    },
  didMount: ({state, send}) =>
    state.searchClient
    |> Algolia.Helper.on(
         `result((results, _) => send(ResultsChanged(results##hits)))
       )
    |> ignore,
  render: ({state, send, handle}) =>
    <SearchBox
      render=(
        classes =>
          <div className=classes.root>
            <MaterialUi.Input
              className=classes.searchField
              placeholder="Search songs"
              value=(`String(state.query))
              autoFocus=focusOnMount
              onChange=(e => send(QueryChanged(Obj.magic(e)##target##value)))
              onKeyDown=(e => send(KeyDown(Obj.magic(e)##keyCode)))
            />
            <Control.If cond=(Array.length(state.results) > 0)>
              ...(
                   () =>
                     <Control.Map items=state.results>
                       ...(
                            song =>
                              <SongSearchResultItem
                                song
                                isFocused=(
                                  Option.exists(
                                    this => this##name === song##name,
                                    state.focused
                                  )
                                )
                                key=song##objectID
                                onClick=(s => send(SelectItem(s)))
                              />
                          )
                     </Control.Map>
                 )
            </Control.If>
          </div>
      )
    />
};
