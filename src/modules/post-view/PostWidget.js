import React, { Component } from "react";
import { Segment, Icon, Label, Button, Dimmer } from "semantic-ui-react";
import { parseGraphData } from "./../../components/widgets/lib";
import { manifests } from "./../../components/widgets";
import gql from "graphql-tag";
import apolloClient from "./../../lib/apollo";
import WidgetContext from "../../contexts/WidgetContext";

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
  async stateFromData(data) {
    this.setState({
      types: data.propTypes,
      values: data.propValues,
      ...data
    });
  }
  async componentWillMount() {
    const { fromRefNo, fromData } = this.props;
    if (fromRefNo) {
      const { data } = await apolloClient.query({
        query: POST_WIDGET,
        variables: {
          refNo: fromRefNo
        }
      });
      this.setState(parseGraphData(data.PostWidget.postWidget));
    } else if (fromData) {
      console.log("fromData"); //TRACE
      console.log(fromData); //TRACE
      // self.setState({user:data.Me.user,loading:undefined})
      // const {name,types,values,postRefNo} = fromData
      await this.stateFromData(fromData);
    }
  }
  render() {
    const { editable, fromData, onEdit } = this.props;
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
        >
          <WidgetContext.Consumer>
            {({ selectWidgetFn }) => (
              <Button.Group>
                <Button
                  type="button"
                  icon
                  title="Move"
                  onClick={() => alert("Soon")}
                >
                  <Icon name="move" />
                </Button>
                <Button
                  type="button"
                  icon
                  title="Edit"
                  onClick={async () => {
                    const widgetData = await selectWidgetFn(fromData);
                    if (widgetData) onEdit && onEdit(widgetData);
                  }}
                >
                  <Icon name="edit" />
                </Button>
                <Button
                  type="button"
                  icon
                  title="Duplicate"
                  onClick={() => alert("Soon")}
                >
                  <Icon name="copy outline" />
                </Button>
                <Button
                  type="button"
                  icon
                  title="Cancel"
                  onClick={() => this.setState({ showControls: false })}
                >
                  <Icon name="ban" />
                </Button>
              </Button.Group>
            )}
          </WidgetContext.Consumer>
        </Dimmer>
      </Dimmer.Dimmable>
    );
  }
}
