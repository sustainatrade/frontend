import React, { Component } from "react";
import { Header, Segment, Button } from "semantic-ui-react";
import { templates } from "./../../components/widgets";
import Icon from "antd/lib/icon";

export default class CreatePost extends Component {
  state = { selectedTemplate: "buy-item" };
  render() {
    const { selectedTemplate } = this.state;
    let SelectedTemplate;
    if (selectedTemplate) {
      SelectedTemplate = templates[selectedTemplate].component;
    }
    return (
      <Segment basic>
        <Header as="h1" dividing>
          Create Post
        </Header>
        <div>
          {Object.keys(templates).map(tCode => {
            const template = templates[tCode];
            console.log("template"); //TRACE
            console.log(template); //TRACE
            return (
              <Button
                key={tCode}
                onClick={() => {
                  this.setState({ selectedTemplate: tCode });
                }}
              >
                <Icon {...template.icon} />
              </Button>
            );
          })}
        </div>
        {selectedTemplate && <SelectedTemplate />}
      </Segment>
    );
  }
}
