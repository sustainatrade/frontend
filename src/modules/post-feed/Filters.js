import React from "react";
import Searches from "./Searches";
import "./Filters.css";
import {
  List,
  Segment,
  Accordion,
  Divider,
  Label,
  Button,
  Icon
} from "semantic-ui-react";
import Drawer from "antd/lib/drawer";
import PostFeedContext from "./../../contexts/PostFeedContext";

const FilterTag = ({ color, text, filterKey }) => (
  <div>
    <PostFeedContext.Consumer>
      {({ filterOpened, showFilterDrawer }) => (
        <Button
          as="div"
          labelPosition="left"
          onClick={e => {
            showFilterDrawer(!filterOpened);
          }}
        >
          <Label as="a" basic color={color}>
            {text.toUpperCase()}
          </Label>
          <Button
            icon
            color={color}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              alert("delete");
            }}
          >
            <Icon name="x" />
          </Button>
        </Button>
      )}
    </PostFeedContext.Consumer>
  </div>
);

const FilterContent = () => (
  <React.Fragment>
    <Searches />
    <FilterTag text="buy" color="orange" />
    <FilterTag text="selling" color="green" />
    <FilterTag text="selling" color="green" />
    <FilterTag text="selling" color="green" />
    <FilterTag text="selling" color="green" />
    <FilterTag text="selling" color="green" />
  </React.Fragment>
);

const FilterWrapper = props => (
  <PostFeedContext.Consumer>
    {({ filterActiveIndex, setFilterActiveIndex }) => {
      const { children, index } = props;
      const active = filterActiveIndex === index;
      return (
        <React.Fragment>
          <Accordion.Title
            active={active}
            index={index}
            onClick={e => setFilterActiveIndex(active ? null : index)}
          >
            <Icon name="dropdown" />
            What is a dog?{" "}
            <Button
              size="mini"
              compact
              floated="right"
              onClick={e => e.stopPropagation()}
            >
              Clear
            </Button>
          </Accordion.Title>
          <Accordion.Content active={active}>{children}</Accordion.Content>
        </React.Fragment>
      );
    }}
  </PostFeedContext.Consumer>
);

export default class Filters extends React.Component {
  state = {};
  render() {
    const { isMobile } = this.props;
    return (
      <React.Fragment>
        {isMobile && <Divider style={{ marginTop: 35 }} />}
        <div className={isMobile ? "filter-menu" : "filter-desktop"}>
          {isMobile ? (
            <section className="filter-scroller">
              <FilterContent />
            </section>
          ) : (
            <FilterContent />
          )}
        </div>
        <PostFeedContext.Consumer>
          {({ filterOpened, showFilterDrawer }) => (
            <Drawer
              title={
                <div>
                  <Icon name="filter" />
                  Filters
                </div>
              }
              width={isMobile ? "100%" : 480}
              placement="right"
              onClose={e => showFilterDrawer(false)}
              visible={filterOpened}
              style={{
                height: "calc(100% - 56px)",
                overflow: "auto",
                paddingBottom: 53
              }}
            >
              <Accordion fluid>
                <FilterWrapper index={0}>hi</FilterWrapper>
                <Divider />
                <FilterWrapper index={1}>hi2</FilterWrapper>
              </Accordion>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  borderTop: "1px solid #e8e8e8",
                  padding: "10px 16px",
                  textAlign: "right",
                  left: 0,
                  background: "#fff",
                  borderRadius: "0 0 4px 4px"
                }}
              >
                <Button
                  style={{
                    marginRight: 8
                  }}
                  onClick={this.onClose}
                >
                  Cancel
                </Button>
                <Button onClick={this.onClose} type="primary">
                  Submit
                </Button>
              </div>
            </Drawer>
          )}
        </PostFeedContext.Consumer>
      </React.Fragment>
    );
  }
}
