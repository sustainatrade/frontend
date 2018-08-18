import React from "react";
import Searches from "./Searches";
import "./Filters.css";

export default class Filters extends React.Component {
  render() {
    const { isMobile } = this.props;
    return (
      <div
        className="filter-menu"
        style={{
          left: isMobile ? 0 : 250
        }}
      >
        <Searches />
      </div>
    );
  }
}
