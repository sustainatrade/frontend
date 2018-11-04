import React, { Component } from "react";
import { Segment, Icon, Label, Button, Dimmer } from "semantic-ui-react";
import { parseGraphData } from "./../../components/widgets/lib";
import { manifests } from "./../../components/widgets";
import gql from "graphql-tag";
import apolloClient from "./../../lib/apollo";

const POST_WIDGET = gql`
  query($refNo: String!) {
    PostWidget(input: { _refNo: $refNo }) {
      status
      postWidget {
        name
        types
        values
        _refNo
        postRefNo
      }
    }
  }
`;

export default class PostWidget extends Component {
  state = {
    showControls: false
  };
  async stateFromData(data = {}) {
    const newState = Object.assign({}, data);
    // eslint-disable-next-line
    if (data.propTypes) newState.types = data.propTypes;
    if (data.propValues) newState.values = data.propValues;
    this.setState(newState);
  }
  async componentWillMount() {
    const { fromRefNo, data, onRendered } = this.props;
    if (fromRefNo) {
      const { data } = await apolloClient.query({
        query: POST_WIDGET,
        variables: {
          refNo: fromRefNo
        }
      });
      await this.setState(parseGraphData(data.PostWidget.postWidget));
    }
    // self.setState({user:data.Me.user,loading:undefined})
    // const {name,types,values,postRefNo} = data
    await this.stateFromData(data);
    const { showControls, ...renderedState } = this.state;
    onRendered && onRendered(renderedState);
  }
  render() {
    const { editable, onEdit, onDelete } = this.props;
    const { name, values, showControls } = this.state;

    if (!name) return <div>loading...</div>;

    const Widget = manifests[name].component;
    return (
      <Dimmer.Dimmable
        as={Segment}
        piled
        compact
        textAlign="center"
        dimmed={showControls}
      >
        {editable && (
          <Label
            as="a"
            size="tiny"
            floating
            onClick={() => this.setState({ showControls: !showControls })}
          >
            <Icon
              name={showControls ? "ban" : "pencil alternate"}
              style={{ margin: 0 }}
            />
          </Label>
        )}
        <Widget {...values} />
        <Dimmer
          active={showControls}
          onClickOutside={() => this.setState({ showControls: false })}
        />
      </Dimmer.Dimmable>
    );
  }
}
