import createHistory from "history/createBrowserHistory";
import React from "react";

// listen to the browser history
const history = createHistory();

const HLink = ({ to, children, ...others }) => (
  <a
    href={to}
    onClick={event => {
      event.preventDefault();
      history.push(to);
    }}
    {...others}
  >
    {children}
  </a>
);

export { history, HLink };
