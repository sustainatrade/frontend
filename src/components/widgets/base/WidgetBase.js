import React from "react";
import PostWidgetContext from "./../../../contexts/PostWidgetContext";
import PropTypes from "prop-types";
import { Segment, Header } from "semantic-ui-react";
import Icon from "antd/lib/icon";

class WidgetBase extends React.Component {
  render() {
    const {
      code,
      name,
      icon,
      editor,
      view,
      compact,
      mode = "view"
    } = this.props;
    let RenderObj;
    switch (mode) {
      case "compact":
        RenderObj = () => compact;
        break;
      case "view":
        RenderObj = () => view;
        break;
      case "editor":
        RenderObj = () => editor;
        break;
      default:
        RenderObj = () => <span>Empty</span>;
    }
    return (
      <Segment key={code}>
        <Header>
          <Icon {...icon} /> {name}
        </Header>
        <PostWidgetContext.Consumer>
          {context => <RenderObj context={context} />}
        </PostWidgetContext.Consumer>
      </Segment>
    );
  }
}

WidgetBase.propTypes = {
  code: PropTypes.string.isRequired,
  editor: PropTypes.node.isRequired,
  view: PropTypes.node.isRequired,
  compact: PropTypes.node.isRequired
};

export default WidgetBase;
