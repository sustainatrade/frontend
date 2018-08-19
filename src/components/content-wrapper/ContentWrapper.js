import React from "react";
import { Portal, Segment } from "semantic-ui-react";
import ResponsiveContext from "./../../contexts/Responsive";
import "./wrapper.css";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from "body-scroll-lock";
import nanoid from "nanoid";

export default class ContentWrapper extends React.Component {
  domId = nanoid();
  targetElement = null;

  componentWillMount() {}
  componentWillUnmount() {
    clearAllBodyScrollLocks();
  }
  onMount() {
    const { domId } = this;
    this.targetElement = document.querySelector("#" + domId);
    disableBodyScroll(this.targetElement);
  }
  onUnmount() {
    const { domId } = this;
    this.targetElement = document.querySelector("#" + domId);
    enableBodyScroll(this.targetElement);
  }
  render() {
    const { children, onMount, onUnmount, ...rest } = this.props;
    const { domId } = this;
    return (
      <React.Fragment>
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
                id={domId}
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
      </React.Fragment>
    );
  }
}
