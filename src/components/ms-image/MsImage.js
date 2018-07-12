import React, { Component } from "react";
import { Image, Dimmer, Loader } from "semantic-ui-react";
import axios from "axios";
import ContentLoader from "react-content-loader";

const PlaceHolder = props => (
  <ContentLoader
    height={props.height}
    width={props.width}
    speed={2}
    style={{ margin: 0 }}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" />
  </ContentLoader>
);

export default class MsImage extends Component {
  state = {
    loaded: false
  };
  async componentWillMount() {
    const { src, width, height } = this.props;
    let newSrc;
    if (src.startsWith("data:image")) {
      newSrc = src;
    } else {
      newSrc = src + `?width=${width}&height=${height}`;
      await axios(newSrc);
    }
    this.setState({ loaded: true, src: newSrc });
  }
  render() {
    const {
      as: Comp = Image,
      src: oldSrc,
      loading,
      width,
      children,
      style: oldStyle = {},
      height,
      block,
      ...otherProps
    } = this.props;
    const { loaded, src } = this.state;
    const style = {
      ...oldStyle,
      display: !!block ? "block" : "inline-block"
    };
    return (
      <Comp {...otherProps} style={style}>
        <React.Fragment>
          {loading && (
            <Dimmer inverted active>
              <Loader />
            </Dimmer>
          )}
          {!loaded && <PlaceHolder height={height} width={width} />}
          {loaded && <img src={src} alt="/" />}
          {children}
        </React.Fragment>
      </Comp>
    );
  }
}
