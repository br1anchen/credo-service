let ste = ReasonReact.string;

let component = ReasonReact.statelessComponent("QueryView");

let make =
    (
      ~result: ReasonApolloTypes.queryResponse('a),
      ~accessData: 'a => option('b),
      ~render: ('b, 'c) => ReasonReact.reactElement,
      ~onLoadMore: ('b, 'unit) => unit=(_, ()) => (),
      _children,
    ) => {
  ...component,
  render: _self =>
    switch (result) {
    | Error(error) => <div> {error##message |> ste} </div>
    | Loading => ReasonReact.null
    | Data(response) =>
      switch (accessData(response)) {
      | Some(data) => render(data, onLoadMore(data))
      | _ => <div> {"Unkown error" |> ste} </div>
      }
    },
};
