import React from "react";
import { Portal, Segment, Dimmer } from "semantic-ui-react";
import ResponsiveContext from "./../../contexts/Responsive";
import "./wrapper.css";

export default class ContentWrapper extends React.Component {
  state = { active: false };
  onMount() {
    this.setState({ active: true });
  }
  onUnmount() {
    this.setState({ active: false });
  }
  render() {
    const { children, onMount, onUnmount, ...rest } = this.props;
    const { active } = this.state;
    return (
      <React.Fragment>
        <Dimmer active={active} page style={{ zIndex: 898 }}>
          Halt!
        </Dimmer>
        <Portal
          {...rest}
          onMount={e => {
            this.onMount(e);
            onMount && onMount(e);
          }}
          onUnmount={e => {
            this.onUnmount(e);
            onUnmount && onUnmount(e);
          }}
        >
          <ResponsiveContext.Consumer>
            {({ isMobile }) => (
              <Segment
                className="wrapper"
                style={{
                  left: isMobile ? "0" : "250px",
                  margin: 0,
                  width: isMobile ? "100%" : "calc(100% - 250px)",
                  height: "calc(100% - 150px)",
                  position: "fixed",
                  top: "50px",
                  zIndex: 900
                }}
              >
                {children}
              </Segment>
            )}
          </ResponsiveContext.Consumer>
        </Portal>
      </React.Fragment>
    );
  }
}
