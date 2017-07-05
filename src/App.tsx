import * as React from "react";
import * as ReactDOM from "react-dom";

import Grid from "./components/Hello";

ReactDOM.render(
  <Grid compiler="TypeScript" framework="React" />,
  document.getElementById("app")
);