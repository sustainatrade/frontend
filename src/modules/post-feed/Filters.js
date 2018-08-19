import React from "react";
import Searches from "./Searches";
import "./Filters.css";
import { List, Segment, Button } from "semantic-ui-react";

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
        <section className="filter-scroller">
          <Searches />
          <Button.Group>
            <Button content="Buy" color="orange" />
            <Button content="All Categories" />
            <Button icon="plus" color="grey" style={{ marginRight: 10 }} />
          </Button.Group>
        </section>
      </div>
    );
  }
}
