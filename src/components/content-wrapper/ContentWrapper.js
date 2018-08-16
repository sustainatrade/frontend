import React from "react";
import { Portal, Segment } from "semantic-ui-react";
import ResponsiveContext from "./../../contexts/Responsive";
import "./wrapper.css";

export default class ContentWrapper extends React.Component {
  onMount() {
    document.body.style.overflowY = "hidden";
  }
  onUnmount() {
    document.body.style.overflowY = "auto";
  }
  render() {
    const { children, onMount, onUnmount, ...rest } = this.props;
    return (
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
                height: "calc(100% - 50px)",
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
    );
  }
}
