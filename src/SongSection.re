type action =
  | Search(string);

type state = {
  keyword: string    
};

let component = ReasonReact.reducerComponent("SongSection");

let make = (_children) => {
  ...component,
  initialState: () => {
    keyword: "",
  },
  reducer: action =>
      switch (action) {
      | Search(value) => (
         state => ReasonReact.UpdateWithSideEffects(
           {...state, keyword: value},
           (_self => Js.log("Search: " ++ value))
         )
        )
      },
  render: (self) =>
    <MaterialUi.Input
      placeholder="input search text"
      onChange=(
        event => self.send(Search(ReactEvent.Form.target(event)##value))
      )
    />
};
